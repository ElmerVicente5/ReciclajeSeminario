import express from 'express';

import { verifyToken } from '../middlewares/middleware.js';

import { getCalendario } from '../controllers/calendario.controller.js';
const calendarioRouter = express.Router();

calendarioRouter.get('/', verifyToken, getCalendario);


export default calendarioRouter;