import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

export const obtenerMetricasDashboard = async (fechaInicio, fechaFin) => {
  try {
    // Filtro de fechas para modelos que sí lo tienen
    const fechaFilter = {
      gte: new Date(fechaInicio),
      lte: new Date(fechaFin),
    };

    // Usuarios
    const totalUsuarios = await prisma.usuarios.count({
      where: { fecha_registro: fechaFilter }
    });
    const usuariosActivos = await prisma.usuarios.count({
      where: { estado: "ACTIVO", fecha_registro: fechaFilter }
    });
    const usuariosPorRol = await prisma.usuarios.groupBy({
      by: ["rol_id"],
      _count: { rol_id: true },
      where: { fecha_registro: fechaFilter }
    });

    // Puntos por zona (usa actualizado_en en vez de fecha_registro)
    const puntosPorZona = await prisma.puntosporzona.findMany({
      select: {
        zonas: { select: { nombre: true } },
        puntos: true,
        periodo: true
      },
      where: { actualizado_en: fechaFilter }
    });

    // Eventos por categoría
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

    // Notificaciones (usa fecha_registro si existe, si no, usar programada_en)
    const notificaciones = {
      enviadas: await prisma.notificaciones.count({
        where: { programada_en: fechaFilter }
      }),
      pendientes: await prisma.notificaciones.count({
        where: { programada_en: fechaFilter, enviada_en: null }
      })
    };

    // Centros de acopio (sin filtro de fecha)
    const centrosAcopio = await prisma.centrosacopio.count();

    // Rutas (sin filtro de fecha)
    const rutas = await prisma.rutas.count();

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
    // Respuesta segura para frontend
    return {
      usuarios: { total: 0, activos: 0, inactivos: 0, porRol: [] },
      notificaciones: { enviadas: 0, pendientes: 0 },
      zonas: [],
      tipos_residuos: [],
      centros_acopio: 0,
      rutas: 0,
      error: error.message || "Error interno del servidor"
    };
  }
};
