import { obtenerAcopio } from '../services/acopio.service.js';
import { validationResult } from 'express-validator';

export const getAcopio = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const acopio = await obtenerAcopio();
        res.json({
            message: "Acopio obtenido exitosamente",
            data: acopio
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener el acopio",
            error: error.message
        });
    }
};