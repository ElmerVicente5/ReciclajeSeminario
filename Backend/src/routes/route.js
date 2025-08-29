import express from 'express';
import {test, login, register, getRankingByZone} from '../controllers/controller.js';
import { verifyToken } from '../middlewares/middleware.js';

const router = express.Router();

router.get('/test', test);

 /**
    * @swagger
    * /api/login:
    *   post:
    *     summary: Inicio de sesión
    *     requestBody:
    *       required: true
    *       content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               nombreUsuario:
    *                 type: string
    *               contrasenia:
    *                 type: string
    *     responses:
    *       200:
    *         description: Inicio de sesión exitoso
    *       401:
    *         description: Credenciales inválidas
    *       403:
    *         description: Usuario inactivo o no encontrado
    *       500:
    *         description: Error interno del servidor
    */
router.post('/login', login);

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registro de usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreCompleto:
 *                 type: string
 *               nombreUsuario:
 *                 type: string
 *               contrasenia:
 *                 type: string
 *              
 *     responses:
 *       200:
 *         description: Registrado correctamente
 *       400:
 *         description: El usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/register', register);

/**
 * @swagger
 * /api/ranking:
 *   get:
 *     summary: Obtener ranking por zona (más residuos)
 *     description: Retorna el ranking de zonas (colonias) ordenado por la mayor cantidad de residuos registrados, con desglose por tipo de residuo.
 *     tags:
 *       - Ranking
 *     responses:
 *       200:
 *         description: Ranking obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Número de zonas en el ranking
 *                 data:
 *                   type: array
 *                   description: Lista de zonas con su información de ranking
 *                   items:
 *                     type: object
 *                     properties:
 *                       zonaId:
 *                         type: integer
 *                       zonaNombre:
 *                         type: string
 *                       zonaCodigo:
 *                         type: string
 *                       totalResiduos:
 *                         type: integer
 *                         description: Total de residuos (conteo de eventos) en la zona
 *                       residuosRecolectados:
 *                         type: array
 *                         description: Detalle por tipo de residuo en la zona
 *                         items:
 *                           type: object
 *                           properties:
 *                             tipoResiduoId:
 *                               type: integer
 *                               nullable: true
 *                               description: Puede ser null si el evento no especifica tipo
 *                             tipoNombre:
 *                               type: string
 *                             total:
 *                               type: integer
 *       500:
 *         description: Error interno del servidor
 */
router.get('/ranking', verifyToken, getRankingByZone);

export {router};

