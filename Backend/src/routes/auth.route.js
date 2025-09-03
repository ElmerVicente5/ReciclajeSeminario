import { login, register, obtenerUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario } from "../controllers/auth.controller.js";
import { body } from "express-validator";
import { Router } from "express";

const routerAuth = Router();
const users = Router();
const authValidation = [
    body('nombreUsuario').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('contrasenia').notEmpty().withMessage('La contraseña es requerida'),
]
const registerValidation = [
    body('nombreCompleto').notEmpty().withMessage('El nombre completo es requerido'),
    body('nombreUsuario').notEmpty().withMessage('El nombre de usuario es requerido'),
    body('contrasenia').notEmpty().withMessage('La contraseña es requerida'),
]

 /**
    * @swagger
    * /api/auth/login:
    *   post:
    *     tags:
    *       - Auth
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
 routerAuth.post('/login',authValidation,login);

 /**
  * @swagger
  * /api/auth/register:
  *   post:
  *     summary: Registro de usuario
  *     tags:
  *       - Auth
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
 routerAuth.post('/register', registerValidation, register);

 /**
  * @swagger
  * /api/usuarios/obtenerUsuarios:
  *   get:
  *     summary: Obtener usuarios
  *     tags:
  *       - Auth
  *     responses:
  *       200:
  *         description: Usuarios encontrados
  *       500:
  *         description: Error interno del servidor
  */
 users.get('/obtenerUsuarios', obtenerUsuarios);

 /**
  * @swagger
  * /api/usuarios/obtenerUsuarioId/{id}:
  *   get:
  *     summary: Obtener usuario por ID
  *     tags:
  *       - Auth
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID del usuario
  *     responses:
  *       200:
  *         description: Usuario encontrado
  *       404:
  *         description: Usuario no encontrado
  *       500:
  *         description: Error interno del servidor
  */
 users.get('/obtenerUsuarioId/:id', obtenerUsuarioPorId);

 /**
  * @swagger
  * /api/usuarios/actualizarUsuario/{id}:
  *   put:
  *     summary: Actualizar usuario
  *     tags:
  *       - Auth
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID del usuario
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
  *               rol_id:
  *                 type: integer
  *               estado:
  *                 type: string
  *               zona_id:
  *                 type: integer
  *     responses:
  *       200:
  *         description: Usuario actualizado correctamente
  *       400:
  *         description: Debe proporcionar al menos un campo para actualizar
  *       404:
  *         description: Usuario no encontrado
  *       500:
  *         description: Error interno del servidor
  */
 users.put('/actualizarUsuario/:id', actualizarUsuario);

 /**
  * @swagger
  * /api/usuarios/eliminarUsuario/{id}:
  *   delete:
  *     summary: Eliminar usuario
  *     tags:
  *       - Auth
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: integer
  *         description: ID del usuario
  *     responses:
  *       200:
  *         description: Usuario eliminado correctamente
  *       404:
  *         description: Usuario no encontrado
  *       500:
  *         description: Error interno del servidor
  */
 users.delete('/eliminarUsuario/:id', eliminarUsuario);

export {
    routerAuth,
    users
}
