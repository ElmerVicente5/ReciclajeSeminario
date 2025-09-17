import express from 'express';

import { verifyToken } from '../middlewares/middleware.js';

import { getCalendario,
    crearHorario,
    obtenerCalendarioRecoleccion,
    updateHorario,
     deleteHorario  } from '../controllers/calendario.controller.js';
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


/**
 * @swagger
 * /api/calendario/obtenerCalendario:
 *   get:
 *     summary: Obtener todo el calendario de recolección
 *     description: Devuelve todos los horarios registrados en el calendario de recolección, incluyendo información de las rutas y zonas asociadas.
 *     tags: [Calendario]
 *     security:
 *       - bearerAuth: []  # JWT requerido
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
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       dia_semana:
 *                         type: integer
 *                         example: 1
 *                         description: Día de la semana (0=Domingo, 6=Sábado)
 *                       hora_inicio:
 *                         type: string
 *                         example: "1970-01-01T08:00:00.000Z"
 *                       hora_fin:
 *                         type: string
 *                         example: "1970-01-01T12:00:00.000Z"
 *                       frecuencia:
 *                         type: string
 *                         example: "Semanal"
 *                       notas:
 *                         type: string
 *                         example: "Horario de recolección de residuos orgánicos"
 *                       ruta:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           nombre:
 *                             type: string
 *                             example: "Ruta 1"
 *                           zona:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: integer
 *                                 example: 5
 *                               nombre:
 *                                 type: string
 *                                 example: "Barrio Monterrey"
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
calendarioRouter.get('/obtenerCalendario', verifyToken, obtenerCalendarioRecoleccion);


/**
 * @swagger
 * /api/calendario/update/{id}:
 *   put:
 *     summary: Actualizar un horario en el calendario de recolección
 *     description: Permite modificar los datos de un horario específico en el calendario de recolección.
 *     tags: [Calendario]
 *     security:
 *       - bearerAuth: []  # JWT requerido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hora_inicio:
 *                 type: string
 *                 example: "09:00"
 *                 description: Hora de inicio en formato HH:mm (opcional)
 *               hora_fin:
 *                 type: string
 *                 example: "13:00"
 *                 description: Hora de fin en formato HH:mm (opcional)
 *               frecuencia:
 *                 type: string
 *                 example: "semanal"
 *                 description: Nueva frecuencia de recolección (opcional)
 *               notas:
 *                 type: string
 *                 example: "Se actualizó el horario para días festivos"
 *                 description: Notas adicionales (opcional)
 *     responses:
 *       200:
 *         description: Horario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Horario actualizado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     hora_inicio:
 *                       type: string
 *                       example: "1970-01-01T09:00:00.000Z"
 *                     hora_fin:
 *                       type: string
 *                       example: "1970-01-01T13:00:00.000Z"
 *                     frecuencia:
 *                       type: string
 *                       example: "Quincenal"
 *                     notas:
 *                       type: string
 *                       example: "Se actualizó el horario para días festivos"
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

// Actualizar horario
calendarioRouter.put('/update/:id', verifyToken, updateHorario);


/**
 * @swagger
 * /api/calendario/delete/{id}:
 *   delete:
 *     summary: Eliminar un horario del calendario de recolección
 *     description: Elimina un horario específico en base a su ID.
 *     tags: [Calendario]
 *     security:
 *       - bearerAuth: []  # JWT requerido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del horario a eliminar
 *     responses:
 *       200:
 *         description: Horario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Horario eliminado exitosamente
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
 *                       example: 3
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
 *                       example: "Horario eliminado"
 *       400:
 *         description: Error de validación en el parámetro id
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

// Eliminar horario
calendarioRouter.delete('/delete/:id', verifyToken, deleteHorario);
export default calendarioRouter;