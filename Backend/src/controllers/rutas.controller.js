import { validationResult } from 'express-validator';
import { listarRutasPorZona } from '../services/rutas.service.js';

export const getRutas = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const rutas = await listarRutasPorZona();
        return res.status(200).json({
            rutas
        });
    } catch (error) {
        res.status(500).json({
            message: "Error al obtener las rutas",
            error: error.message
        });
    }
}