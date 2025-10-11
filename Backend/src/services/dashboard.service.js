import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

export const obtenerMetricasDashboard = async (fechaInicio, fechaFin) => {
  try {
    // Filtro de fechas obligatorio
    const fechaFilter = {
      gte: new Date(fechaInicio),
      lte: new Date(fechaFin),
    };

    // Total de usuarios en rango
    const totalUsuarios = await prisma.usuarios.count({
      where: { fecha_registro: fechaFilter }
    });

    // Usuarios activos en rango
    const usuariosActivos = await prisma.usuarios.count({
      where: { estado: "ACTIVO", fecha_registro: fechaFilter }
    });

    // Usuarios por rol en rango
    const usuariosPorRol = await prisma.usuarios.groupBy({
      by: ["rol_id"],
      _count: { rol_id: true },
      where: { fecha_registro: fechaFilter }
    });

    // Puntos por zona en rango
    const puntosPorZona = await prisma.puntosporzona.findMany({
      select: {
        zonas: { select: { nombre: true } },
        puntos: true,
        periodo: true
      },
      where: { fecha_registro: fechaFilter }
    });

    // Eventos por categoría en rango
    const eventosRaw = await prisma.eventospuntosporzona.findMany({
      where: { fecha_registro: fechaFilter },
      select: {
        tiporesiduo: { select: { categoria: true } }
      }
    });

    const eventosPorCategoria = eventosRaw.reduce((acc, curr) => {
      const categoria = curr.tiporesiduo?.categoria || "Sin categoría";
      acc[categoria] = acc[categoria] ? acc[categoria] + 1 : 1;
      return acc;
    }, {});

    const eventosPorCategoriaArray = Object.entries(eventosPorCategoria).map(
      ([categoria, cantidad]) => ({ categoria, cantidad })
    );

    // Notificaciones en rango
    const notificaciones = {
      enviadas: await prisma.notificaciones.count({
        where: { fecha_registro: fechaFilter }
      }),
      pendientes: await prisma.notificaciones.count({
        where: { fecha_registro: fechaFilter, enviada_en: null }
      })
    };

    // Cantidad de centros de acopio en rango
    const centrosAcopio = await prisma.centrosacopio.count({
      where: { fecha_registro: fechaFilter }
    });

    // Cantidad de rutas en rango
    const rutas = await prisma.rutas.count({
      where: { fecha_registro: fechaFilter }
    });

    return {
      usuarios: {
        total: totalUsuarios,
        activos: usuariosActivos,
        inactivos: totalUsuarios - usuariosActivos,
        porRol: usuariosPorRol
      },
      zonas: puntosPorZona,
      tipos_residuos: eventosPorCategoriaArray,
      notificaciones,
      centros_acopio: centrosAcopio,
      rutas
    };
  } catch (error) {
    throw error;
  }
};
