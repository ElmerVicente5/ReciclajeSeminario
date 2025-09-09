import express from 'express';
import { verifyToken } from '../middlewares/middleware.js';
import { getAcopio } from '../controllers/acopio.controller.js';

const acopioRouter = express.Router();

/**
 * @swagger
 * /api/acopio/listarAcopios:
 *   get:
 *     summary: Obtener acopio
 *     description: Obtener informacion de los acopios con sus zonas
 *     tags:
 *       - Acopios
 *     responses:
 *       200:
 *         description: Acopio obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipo:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 latitud:
 *                   type: string
 *                 longitud:
 *                   type: string
 *                 direccion:
 *                   type: string
 *                 zona_id:
 *                   type: number
 *                 horario:
 *                   type: string
 *                 zonas:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     nombre:
 *                       type: string
 *                     codigo:
 *                       type: string
 *       400:
 *         description: Error al obtener el acopio
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error interno del servidor
 *       
 * 
 */
acopioRouter.get('/listarAcopios', verifyToken, getAcopio);

export default acopioRouter;