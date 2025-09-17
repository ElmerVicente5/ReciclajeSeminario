import express from 'express';

import { verifyToken } from '../middlewares/middleware.js';
import { verifyTokenApp } from '../middlewares/middleware.app.js';

import { getCalendario, crearHorario, getCalendarioPorDias, getInformacionCalendario } from '../controllers/calendario.controller.js';
const calendarioRouter = express.Router();
const calendarioRouterApp = express.Router();


/**
 * @swagger
 * tags:
 *   name: Calendario
 *   description: Gestión de calendario
 */

/**
 * @swagger
 * /api/calendario:
 *   get:
 *     summary: Obtener calendario según zona y fecha
 *     description: Devuelve los datos del calendario para una zona específica y un día de la semana derivado de la fecha indicada.
 *     tags: [Calendario]
 *     security:
 *       - bearerAuth: []   # Esto indica que usa JWT
 *     parameters:
 *       - in: query
 *         name: zona
 *         schema:
 *           type: string
 *         required: true
 *         description: Zona de la que se desea obtener el calendario
 *       - in: query
 *         name: fecha
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha en formato YYYY-MM-DD para calcular el día de la semana
 *     responses:
 *       200:
 *         description: Calendario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Calendario obtenido exitosamente
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     description: Información del calendario por día y zona
 *       400:
 *         description: Error de validación en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */
calendarioRouter.get('/', verifyToken, getCalendario);


/**
 * @swagger
 * /api/calendario/insert:
 *   post:
 *     summary: Crear un nuevo horario en el calendario de recolección
 *     description: Inserta un nuevo horario asociado a una ruta específica, día de la semana, hora de inicio y fin.
 *     tags: [Calendario]
 *     security:
 *       - bearerAuth: []  # JWT requerido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ruta_id:
 *                 type: integer
 *                 example: 2
 *                 description: ID de la ruta a la que pertenece el horario
 *               dia_semana:
 *                 type: integer
 *                 example: 1
 *                 description: Día de la semana (0=Domingo, 6=Sábado)
 *               hora_inicio:
 *                 type: string
 *                 example: "08:00"
 *                 description: Hora de inicio en formato HH:mm
 *               hora_fin:
 *                 type: string
 *                 example: "12:00"
 *                 description: Hora de fin en formato HH:mm
 *               frecuencia:
 *                 type: string
 *                 example: "Semanal"
 *                 description: Frecuencia de recolección (opcional)
 *               notas:
 *                 type: string
 *                 example: "Horario de recolección de residuos orgánicos"
 *                 description: Notas adicionales (opcional)
 *     responses:
 *       201:
 *         description: Horario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Horario creado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     ruta_id:
 *                       type: integer
 *                       example: 2
 *                     dia_semana:
 *                       type: integer
 *                       example: 1
 *                     hora_inicio:
 *                       type: string
 *                       example: "1970-01-01T08:00:00.000Z"
 *                     hora_fin:
 *                       type: string
 *                       example: "1970-01-01T12:00:00.000Z"
 *                     frecuencia:
 *                       type: string
 *                       example: "Semanal"
 *                     notas:
 *                       type: string
 *                       example: "Horario de recolección de residuos orgánicos"
 *       400:
 *         description: Error de validación en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 *                       param:
 *                         type: string
 *                       location:
 *                         type: string
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */

calendarioRouter.post('/insert', verifyToken, crearHorario);

/**
 * @swagger
 * /api/app/calendario/dias:
 *   get:
 *     summary: Obtener calendario por días del mes
 *     description: Devuelve todas las fechas de un mes específico organizadas por días de la semana según la configuración del calendario de recolección.
 *     tags: [App]
 *     security:
 *       - bearerAuth: []   # JWT requerido para aplicación móvil
 *     parameters:
 *       - in: query
 *         name: mes
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *         required: true
 *         description: Mes del año (1-12)
 *         example: 9
 *       - in: query
 *         name: anio
 *         schema:
 *           type: integer
 *           minimum: 1900
 *         required: true
 *         description: Año (mayor o igual a 1900)
 *         example: 2025
 *     responses:
 *       200:
 *         description: Calendario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dia_semana:
 *                         type: integer
 *                         description: Día de la semana (1=Lunes, 2=Martes, ..., 7=Domingo)
 *                         example: 1
 *                       nombre_mes:
 *                         type: string
 *                         description: Nombre del mes en español
 *                         example: "Septiembre"
 *                       nombre_dia:
 *                         type: string
 *                         description: Nombre del día de la semana en español
 *                         example: "Lunes"
 *                       fechas:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: date
 *                         description: Array de fechas en formato ISO (YYYY-MM-DD) que corresponden a ese día de la semana en el mes
 *                         example: ["2025-09-01", "2025-09-08", "2025-09-15", "2025-09-22", "2025-09-29"]
 *               example:
 *                 data:
 *                   - dia_semana: 1
 *                     nombre_mes: "Septiembre"
 *                     nombre_dia: "Lunes"
 *                     fechas: ["2025-09-01", "2025-09-08", "2025-09-15", "2025-09-22", "2025-09-29"]
 *                   - dia_semana: 3
 *                     nombre_mes: "Septiembre"
 *                     nombre_dia: "Miércoles"
 *                     fechas: ["2025-09-03", "2025-09-10", "2025-09-17", "2025-09-24"]
 *       400:
 *         description: Error de validación en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 parametros_requeridos:
 *                   summary: Parámetros faltantes
 *                   value:
 *                     error: "Los parámetros 'mes' y 'anio' son requeridos"
 *                 mes_invalido:
 *                   summary: Mes fuera de rango
 *                   value:
 *                     error: "El mes debe estar entre 1 y 12"
 *                 anio_invalido:
 *                   summary: Año inválido
 *                   value:
 *                     error: "El año debe ser mayor o igual a 1900"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
calendarioRouterApp.get('/dias', verifyTokenApp, getCalendarioPorDias);

/**
 * @swagger
 * /api/app/calendario/informacion/{fecha}:
 *   get:
 *     summary: Obtener información del calendario por fecha
 *     description: Devuelve la información del calendario para un día específico basado en la fecha proporcionada en formato yy-mm-dd. La fecha se convierte automáticamente al día de la semana correspondiente (1=Lunes, 2=Martes, ..., 7=Domingo).
 *     tags: [App]
 *     parameters:
 *       - in: path
 *         name: fecha
 *         schema:
 *           type: string
 *           pattern: ^\d{4}-\d{2}-\d{2}$
 *         required: true
 *         description: Fecha en formato YYYY-MM-DD (ej. 2025-09-16)
 *         example: "2025-09-16"
 *     responses:
 *       200:
 *         description: Información del calendario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dia_semana:
 *                         type: integer
 *                         description: Día de la semana (1=Lunes, 2=Martes, ..., 7=Domingo)
 *                         example: 1
 *                       hora_inicio:
 *                         type: string
 *                         format: time
 *                         description: Hora de inicio de recolección
 *                         example: "08:00:00"
 *                       hora_fin:
 *                         type: string
 *                         format: time
 *                         description: Hora de fin de recolección
 *                         example: "12:00:00"
 *                       frecuencia:
 *                         type: string
 *                         description: Frecuencia de recolección
 *                         example: "Semanal"
 *                       notas:
 *                         type: string
 *                         description: Notas adicionales
 *                         example: "Recolección de residuos orgánicos"
 *                       rutas:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             description: ID de la ruta
 *                             example: 1
 *                           nombre:
 *                             type: string
 *                             description: Nombre de la ruta
 *                             example: "Ruta Centro"
 *                 fecha:
 *                   type: string
 *                   format: date
 *                   description: Fecha completa procesada
 *                   example: "2025-09-16"
 *                 diaSemana:
 *                   type: integer
 *                   description: Número del día de la semana calculado
 *                   example: 2
 *       400:
 *         description: Error de validación en los parámetros
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *               examples:
 *                 fecha_requerida:
 *                   summary: Fecha faltante
 *                   value:
 *                     error: "El parámetro 'fecha' es obligatorio"
 *                 formato_invalido:
 *                   summary: Formato de fecha incorrecto
 *                   value:
 *                     error: "La fecha debe estar en formato yy-mm-dd"
 *                 fecha_invalida:
 *                   summary: Fecha no válida
 *                   value:
 *                     error: "Fecha inválida"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error interno del servidor"
 */
calendarioRouterApp.get('/informacion/:fecha',  getInformacionCalendario);
export default calendarioRouter;
export { calendarioRouterApp };