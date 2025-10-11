import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

const PUNTOS ={
    RECICLABLE: 10,
    NO_RECICLABLE: 2,
    ORGANICO: 5,
    INCIERTO: 1,
}
const CATEGORIAS ={
    RECICLABLE: 'RECICLABLE',
    NO_RECICLABLE: 'NO_RECICLABLE',
    ORGANICO: 'ORGANICO',
    INCIERTO: 'INCIERTO',
}

const  COLORES = {
    RECICLABLE: 'AZUL',
    NO_RECICLABLE: 'NEGRO',
    ORGANICO: 'VERDE',
    INCIERTO: 'ROJO',
}
async function asignarPuntosUsuario(idUsuario,respuestaClasificacion){
    const categoria = respuestaClasificacion['categoria'];
    const materialProbable = respuestaClasificacion['material_probable'];
    const boteSugerido = respuestaClasificacion['bote_sugerido'];


    try{

        const result = await prisma.$transaction(async (trx)=>{
           
            const tipoResidup = await trx.tiporesiduo.create({
                data:{
                    nombre: materialProbable,
                    categoria: CATEGORIAS[categoria],
                    color_contenedor: COLORES[categoria],
                    reciclable: categoria === CATEGORIAS.RECICLABLE,
                }
            })

            const puntosUsuario = await trx.puntosusuario.create({
                data:{
                    id_usuario: parseInt(idUsuario),
                    id_tipo_residuo: tipoResidup.id,
                    total_puntos: PUNTOS[categoria] || 0,
                }
            })

            return 'Puntos asignados correctamente';

        })
        return result;

    }catch(error){
        throw error;
    }
}


async function obtenerMisPuntos(idUsuario){
    try{
        // Obtener información del usuario
        const usuario = await prisma.usuarios.findUnique({
            where: {
                id: parseInt(idUsuario),
            },
            select: {
                id: true,
                nombre_completo: true,
                nombre_usuario: true,
                estado: true,
                zonas: {
                    select: {
                        nombre: true,
                    }
                }
            }
        });

        // Obtener todos los registros de puntos del usuario (sin incluir usuarios)
        const registros = await prisma.puntosusuario.findMany({
            where: {
                id_usuario: parseInt(idUsuario),
            },
            include: {
                tiporesiduo: {
                    select: {
                        nombre: true,
                        categoria: true,
                        color_contenedor: true,
                    }
                }
                
            },
            orderBy: {
                id: 'desc' // Ordenar por ID descendente para mostrar los más recientes primero
            }
        })

        // Calcular el total de puntos sumando todos los total_puntos
        const totalPuntos = registros.reduce((sum, registro) => {
            return sum + (registro.total_puntos || 0);
        }, 0);

        // Retornar los registros junto con el total de puntos y info del usuario
        return {
            usuario: usuario,
            registros: registros,
            totalPuntos: totalPuntos,
            cantidadRegistros: registros.length
        };
    }
    catch(error){
        throw error;
    }
}

export { asignarPuntosUsuario, obtenerMisPuntos };