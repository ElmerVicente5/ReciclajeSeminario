import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();

export async function rankingZonas(userId = null) {
    try {
        // Agrupar puntosusuario por usuario y sumar sus puntos
        const puntosPorUsuario = await prisma.puntosusuario.groupBy({
            by: ['id_usuario'],
            _sum: {
                total_puntos: true
            }
        });

        //Obtener los usuarios con sus zonas
        const usuariosConZona = await prisma.usuarios.findMany({
            where: {
                id: {
                    in: puntosPorUsuario.map(p => p.id_usuario)
                }
            },
            select: {
                id: true,
                zona_id: true
            }
        });

        // mapa usuario->zona
        const zonaByUsuario = Object.fromEntries(
            usuariosConZona.map(u => [u.id, u.zona_id])
        );

        //Agrupar puntos por zona
        const puntosPorZona = {};
        puntosPorUsuario.forEach(p => {
            const zonaId = zonaByUsuario[p.id_usuario];
            if (zonaId) {
                puntosPorZona[zonaId] = (puntosPorZona[zonaId] || 0) + (p._sum.total_puntos || 0);
            }
        });

        //Obtener nombres de las zonas
        const zonasIds = Object.keys(puntosPorZona).map(id => parseInt(id));
        const zonas = await prisma.zonas.findMany({
            where: {
                id: {
                    in: zonasIds
                }
            },
            select: {
                id: true,
                nombre: true
            }
        });

        //Incluir zonas sin puntos
        const todasLasZonas = await prisma.zonas.findMany({
            select: {
                id: true,
                nombre: true
            }
        });

        let userZonaId = null;
        if (userId) {
            const user = await prisma.usuarios.findUnique({
                where: { id: userId },
                select: { zona_id: true }
            });
            userZonaId = user?.zona_id || null;
        }

        //Construir el ranking final
        const ranking = todasLasZonas.map(zona => ({
            zona_id: zona.id,
            zona: zona.nombre,
            total_puntos: puntosPorZona[zona.id] || 0,
            is_user_zona: userId ? zona.id === userZonaId : false
        }));

        //Ordenar por puntos
        return ranking.sort((a, b) => b.total_puntos - a.total_puntos);

    } catch (error) {
        console.error('Error en rankingZonas:', error);
        throw error;
    }
}