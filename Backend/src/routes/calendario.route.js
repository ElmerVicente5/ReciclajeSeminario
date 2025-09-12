import express from 'express';

import { verifyToken } from '../middlewares/middleware.js';

import { getCalendario,crearHorario } from '../controllers/calendario.controller.js';
const calendarioRouter = express.Router();


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

export default calendarioRouter;