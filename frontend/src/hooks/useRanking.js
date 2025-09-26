import { useState, useEffect } from "react";
import { fetchApi } from "../services/api";

const useRanking = () => {
  const [ranking, setRanking] = useState({ data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarRanking = async () => {
    setLoading(true);
    setError("");
    try {
      // Puedes cambiar el endpoint según lo que necesites:
      // /api/ranking-zonas o /api/ranking
      const data = await fetchApi("/api/ranking-zonas");
      setRanking({ data: Array.isArray(data) ? data : [] });
    } catch (err) {
      setError("Error al cargar ranking.");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarRanking();
  }, []);

  return {
    ranking,
    loading,
    error,
  };
};

export default useRanking;