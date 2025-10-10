import { Router } from 'express';
import { obtenerMisPuntosController } from '../controllers/puntorPorusuario.controller.js';
import { verifyToken } from '../middlewares/middleware.js';

const routerPuntosPorUsuario = Router();

/**
 * @swagger
 * /api/puntos/obtenerMisPuntos/{idUsuario}:
 *   get:
 *     summary: Obtiene los puntos acumulados de un usuario
 *     description: Retorna el historial de puntos del usuario con detalles de los residuos clasificados. Solo requiere el ID del usuario en la URL.
 *     tags:
 *       - Puntos por Usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idUsuario      
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario (solo número)
 *         example: 123
 *     responses:
 *       200:
 *         description: Puntos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     usuario:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 123
 *                         nombre_completo:
 *                           type: string
 *                           example: "Juan Pérez"
 *                         nombre_usuario:
 *                           type: string
 *                           example: "juan.perez"
 *                         estado:
 *                           type: string
 *                           example: "activo"
 *                         zonas:
 *                           type: object
 *                           properties:
 *                             nombre:
 *                               type: string
 *                               example: "Zona Norte"
 *                     registros:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           id_tipo_residuo:
 *                             type: integer
 *                             example: 5
 *                           total_puntos:
 *                             type: integer
 *                             example: 10
 *                           tiporesiduo:
 *                             type: object
 *                             properties:
 *                               nombre:
 *                                 type: string
 *                                 example: "Botella de plástico PET"
 *                               categoria:
 *                                 type: string
 *                                 example: "RECICLABLE"
 *                               color_contenedor:
 *                                 type: string
 *                                 example: "plástico"
 *                     totalPuntos:
 *                       type: integer
 *                       description: Suma total de todos los puntos del usuario
 *                       example: 45
 *                     cantidadRegistros:
 *                       type: integer
 *                       description: Número total de registros de puntos
 *                       example: 5
 *                 message:
 *                   type: string
 *                   description: Mensaje informativo (solo cuando no hay datos)
 *                   example: "No se encontraron puntos para este usuario"
 *       400:
 *         description: ID de usuario inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "ID de usuario inválido"
 *       401:
 *         description: Token de autenticación inválido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Token inválido"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Error al obtener puntos del usuario"
 */
routerPuntosPorUsuario.get('/obtenerMisPuntos/:idUsuario',obtenerMisPuntosController);

export default routerPuntosPorUsuario;