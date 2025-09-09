import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();
export const obtenerCalendario = async (zonaNombre, diaSemana) => {
  try {
        const calendario = await prisma.zonas.findMany({
        where: { nombre: zonaNombre },
        include: {
        rutas: {
        include: { calendariorecoleccion: true }
        }
        }
        });
    console.log(calendario);
        return calendario;
    } catch (error) {
        console.error("Error al obtener calendario:", error);
        throw error;
    }
    };
