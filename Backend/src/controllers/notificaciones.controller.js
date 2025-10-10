import { crearNotificacionServicio, obtenerTodasLasNotificacionesServicio } from '../services/notificaiones.service.js';
import { validationResult } from 'express-validator';
const crearNotificacion = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const {titulo, cuerpo, tipo, creadoPor, programadaEn, enviadaEn, audiencia} = req.body;        
        const notificacionCreada = await crearNotificacionServicio({
            titulo, 
            cuerpo, 
            tipo, 
            creadoPor, 
            programadaEn, 
            enviadaEn, 
            audiencia
        });
        res.status(201).json({...notificacionCreada});
    }catch(error){
        console.error('Error en controlador:', error);
        res.status(500).json({message: error.message});
    }
};

const obtenerTodasLasNotificaciones = async (req, res) => {
    try{
        const notificaciones = await obtenerTodasLasNotificacionesServicio();   
        res.status(200).json(notificaciones);
    }catch(error){
        res.status(500).json({message: error.message});
    }
};
export {
    crearNotificacion,
    obtenerTodasLasNotificaciones
}