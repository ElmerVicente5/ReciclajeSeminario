import express from 'express';
import { verifyToken } from '../middlewares/middleware.js';
import { getRutas } from '../controllers/rutas.controller.js';
const rutasRouter = express.Router();

/**
 * @swagger
 * /api/rutas/obtenerRutas:
 *   get:
 *     summary: Obtener rutas
 *     description: Obtener listado de zonas con sus respectivas rutas
 *     tags:
 *       - Rutas
 *     responses:
 *       200:
 *         description: Rutas obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rutas:
 *                   type: array
 *                   description: Lista de rutas
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       nombre:
 *                         type: string
 *                       zona_id:
 *                         type: number
 *                       rutas:
 *                         type: array
 *                         description: Lista de rutas
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: number
 *                             nombre:
 *                               type: string
 *                             zona_id:
 *                               type: number
 *       400:
 *         description: Error al obtener las rutas
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 * 
 * 
 */
rutasRouter.get('/obtenerRutas', verifyToken, getRutas);

export { rutasRouter };