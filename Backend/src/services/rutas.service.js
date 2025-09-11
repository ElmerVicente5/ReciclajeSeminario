import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

export const listarRutasPorZona = async () => {
    try {
        const zonas = await prisma.zonas.findMany();
        const rutas = await prisma.rutas.findMany({
            where: {
                zona_id: {
                    in: zonas.map(zona => zona.id)
                }, 
                activo: true
            }
        });

        const zonasConRutas = zonas.map(zona => {
            const rutasDeZona = rutas.filter(ruta => ruta.zona_id === zona.id);
            if (rutasDeZona.length > 0) {
                return {
                    ...zona,
                    rutas: rutasDeZona
                };
            }
            return null;
        }).filter(Boolean);

        if (zonasConRutas.length === 0) {
            throw { status: 404, message: 'No se encontraron zonas con rutas asignadas' };
        }

        return zonasConRutas;

    } catch (error) {
        if (error.status) {
            throw error;
        }
        throw { status: 500, message: 'Error al obtener las rutas por zona' };
    }
}
