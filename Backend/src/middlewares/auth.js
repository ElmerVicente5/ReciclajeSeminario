import jwt from 'jsonwebtoken';
import {configJwt} from '../config/config.jwt.js';

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token no proporcionado' });

    const token = authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    try {
        const decoded = jwt.verify(token, configJwt.secret);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token inválido o expirado' });
    }
};
