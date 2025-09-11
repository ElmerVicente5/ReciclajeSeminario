import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

export const obtenerAcopio = async () => {
    try {
        const acopio = await prisma.centrosacopio.findMany({
            select: {
                id: true,
                tipo: true,
                nombre: true,
                latitud: true,
                longitud: true,
                direccion: true,
                zona_id: true,
                horario: true,
                zonas: {
                    select: {
                        id: true,
                        nombre: true,
                        codigo: true,
                    },
                },
            },
            orderBy: {
                id: 'desc'
            }

        });
        return acopio;
    } catch (error) {
        console.error("Error al obtener el acopio:", error);
        throw error;
    }
};

export const obtenerListadoAcopioCoordenadas = async () => {
    try {
        const acopio = await prisma.centrosacopio.findMany({
            select: {
                id: true,
                nombre: true,
                latitud: true,
                longitud: true,
            }
        });

        if (acopio.length === 0) {
            return {
                status: 404,
                message: "No se encontraron acopios",
            };
        }

        return acopio;
    } catch (error) {
        console.error("Error al obtener el listado de acopio coordenadas:", error);
        throw error;
    }
};