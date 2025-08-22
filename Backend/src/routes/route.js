import express from 'express';
import {test, login, register} from '../controllers/controller.js';

const router = express.Router();

router.get('/test', test);
router.post('/login', login);
router.post('/register', register);

export {router};

