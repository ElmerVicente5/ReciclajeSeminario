import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();
const TIPOALERTA={
    ALERTA: 'ALERTA',
    NOTIFICACION: 'NOTIFICACION',
    INFORMATIVA: 'INFORMATIVA',
    PROMOCIONAL: 'PROMOCIONAL'

}
const AUDIENCIA = {
    ZONA: 'ZONA',
    USUARIO: 'USUARIO',
    ROL: 'ROL',
    TODOS: 'TODOS'
}

export const crearNotificacionServicio = async (notificacion) => {
    try {
        console.log('Notificación recibida:', JSON.stringify(notificacion, null, 2));
        
        let fechaProgramada = null;
        if (notificacion.programadaEn) {
            const fecha = new Date(notificacion.programadaEn)
            if (isNaN(fecha.getTime())) {
                throw new Error(`Fecha programada inválida: ${notificacion.programadaEn}`);
            }
            fechaProgramada = fecha;
        }
        
        const notificacionCreada = await prisma.$transaction(async (tx) => {
            console.log('Iniciando transacción...');
            
            // Crear la notificación principal
            const notificacionNueva = await tx.notificaciones.create({
                data: {
                     titulo: notificacion.titulo,
                     cuerpo: notificacion.cuerpo,
                     tipo: TIPOALERTA[notificacion.tipo],
                     creado_por: notificacion.creadoPor,
                     programada_en: fechaProgramada,
                     enviada_en: new Date()
                }
            });
            
            console.log('Notificación creada con ID:', notificacionNueva.id);
            console.log('Audiencia recibida:', notificacion.audiencia);
            
            // Crear registros de audiencia si se especifican
            if (notificacion.audiencia && notificacion.audiencia.length > 0) {
                const audienciaData = notificacion.audiencia.map(aud => ({
                    notificacion_id: notificacionNueva.id,
                    tipo_objetivo: aud.tipo_objetivo, // Usar directamente el valor enviado
                    objetivo_id: aud.objetivo_id || null
                }));
                
                console.log('Creando audiencia:', audienciaData);
                
                const audienciaCreada = await tx.audiencianotificaciones.createMany({
                    data: audienciaData
                });
                
                console.log('Audiencia creada:', audienciaCreada);
            } else {
                console.log('No se especificó audiencia');
            }
            
            return true
        });
        
        if(!notificacionCreada){
            throw new Error('No se pudo crear la notificacion');
        }
        return {
            message: 'Notificacion creada exitosamente',
        }
    } catch (error) {
        console.error('Error en crearNotificacionServicio:', error);
        throw error;
    }
};

export const obtenerTodasLasNotificacionesServicio = async () => {
    try {
        const notificaciones = await prisma.notificaciones.findMany({
            select: {
                id: true,
                titulo: true,
                cuerpo: true,
                tipo: true,
                programada_en: true,
                enviada_en: true,
                usuarios:{
                    select: {
                        id: true,
                        nombre_completo: true,
                        nombre_usuario: true,
                        roles: {
                            select: {
                                id: true,
                                nombre: true
                            }
                        }
                    }
                },
                audiencianotificaciones: {
                    select: {
                        id: true,
                        tipo_objetivo: true,
                        objetivo_id: true
                    }
                }
            }
        });
        
        const dataMapped = notificaciones.map(({usuarios, audiencianotificaciones, ...rest})=> {
            return {
                ...rest,
                creado_por: usuarios,
                audiencia: audiencianotificaciones
            }
        });
        
        console.log(dataMapped);
        if(dataMapped.length === 0){
            return [];
        }
        return dataMapped;
    } catch (error) {
        throw error;
    }
};