import { rankingZonas } from '../services/rankinZonas.service.js';
export async function getRankingZonas(req, res) {
    try {
         // si el usuario esta autenticado, pasamos su id para marcar su zona
        const userId =  req.userId;
        const ranking = await rankingZonas(userId);
        res.status(200).json(ranking);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el ranking de zonas' });
    }
}