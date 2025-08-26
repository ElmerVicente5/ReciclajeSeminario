import express from 'express';
import {test, login, register} from '../controllers/controller.js';

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
    *               nombre_usuario:
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
 *               nombre_completo:
 *                 type: string
 *               nombre_usuario:
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

export {router};

