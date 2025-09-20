import express from 'express';
import { verifyToken } from '../middlewares/middleware.js';
import { getAcopio, getAcopioCoordenadas} from '../controllers/acopio.controller.js';

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

/**
 * @swagger
 * /api/acopio/listarAcopiosCoordenadas:
 *   get:
 *     summary: Obtener acopio coordenadas
 *     description: Obtener informacion de los acopios con sus coordenadas
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
 *                 acopio:
 *                   type: array
 *                   description: Lista de acopios
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       nombre:
 *                         type: string
 *                       latitud:
 *                         type: string
 *                       longitud:
 *                         type: string
 * 
 *       400:
 *         description: Error al obtener el acopio
 *       401:
 *         description: No autorizado
 *       404:
 *         description: No se encontraron acopios
 *       500:
 *         description: Error interno del servidor
 * 
 */
acopioRouter.get('/listarAcopiosCoordenadas', verifyToken, getAcopioCoordenadas);

export default acopioRouter;