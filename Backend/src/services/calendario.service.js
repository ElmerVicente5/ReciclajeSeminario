import { PrismaClient } from '../generated/prisma/client.js';
const prisma = new PrismaClient();
export const obtenerCalendario = async (zonaNombre, diaSemana) => {
  try {
    const calendario = await prisma.zonas.findMany({
  where: { nombre: zonaNombre },
  select: {
    id: true,
    nombre: true,
    rutas: {
      where: {
        calendariorecoleccion: { some: { dia_semana: diaSemana } } // solo rutas con horarios en el día especificado
      },
      select: {
        id: true,
        calendariorecoleccion: {
          where: { dia_semana: diaSemana },
          select: {
            hora_inicio: true,
            hora_fin: true,
            frecuencia: true
          }
        }
      }
    }
  }
});

    return calendario;
  } catch (error) {
    console.error("Error al obtener calendario:", error);
    throw error;
  }
};

    // Insertar nuevo horario en calendariorecoleccion

export const insertarHorario = async ({ ruta_id, dia_semana, hora_inicio, hora_fin, frecuencia, notas }) => {
  try {
    // Convertir las horas a ISO-8601
    const fechaFicticia = "1970-01-01";
    const horaInicioISO = new Date(`${fechaFicticia}T${hora_inicio}:00.000Z`);
    const horaFinISO = new Date(`${fechaFicticia}T${hora_fin}:00.000Z`);
    const nuevoHorario = await prisma.calendariorecoleccion.create({
      data: {
        ruta_id,
        dia_semana,
        hora_inicio: horaInicioISO,
        hora_fin: horaFinISO,
        frecuencia,
        notas,
      },
    });
    return nuevoHorario;
  } catch (error) {
    console.error("Error al insertar horario:", error);
    throw error;
  }
};