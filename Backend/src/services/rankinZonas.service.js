import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();
export async function rankingZonas() {
    // Agrupamos por zona y sumamos puntos
    try {
        const rows = await prisma.eventospuntosporzona.groupBy({
            by: ['zona_id'],
            _sum: { puntos: true },
            orderBy: { _sum: { puntos: 'desc' } },
          })
        if(rows.length === 0){
            return [];
        }
          // Traemos los nombres de las zonas
          const zonas = await prisma.zonas.findMany({
            where: { id: { in: rows.map(r => r.zona_id) } },
            select: { id: true, nombre: true },
          })
          const nameById = Object.fromEntries(zonas.map(z => [z.id, z.nombre]))
          
          // Unimos resultados
          return rows.map(r => ({
            zona_id: r.zona_id,
            zona: nameById[r.zona_id] ?? '(sin nombre)',
            total_puntos: Number(r._sum.puntos ?? 0),
          }))
    } catch (error) {
        throw error;
    }
  }