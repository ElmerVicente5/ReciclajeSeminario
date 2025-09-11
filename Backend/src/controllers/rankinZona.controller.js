import { rankingZonas } from '../services/rankinZonas.service.js';
export async function getRankingZonas(req, res) {
    try {
        const ranking = await rankingZonas();
        res.status(200).json(ranking);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el ranking de zonas' });
    }
}