import {configJwt} from '../config/config.jwt.js';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/client.js';
async function verifyToken(req,res,next){
    const token = req.headers['authorization']
    if(!token){
        return res.status(401).json({message: 'No autorizado'});
    }
    try {
        const decoded = await jwt.verify(token, configJwt.secret);
        const prisma = new PrismaClient();  
        const usuarioEncontrado = await prisma.usuarios.findFirst({
            where: {
                id: decoded.id
            }
        });
        if(!usuarioEncontrado){
            return res.status(401).json({message: 'No autorizado'});
        }
        if(decoded.rol != 'USER'){
            return res.status(401).json({message: 'No autorizado'});
        }
        if (decoded.estado != 'ACTIVO'){
            return res.status(401).json({message: 'No autorizado'});
        }
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Unauthorized'});
    }
}

export {verifyToken};