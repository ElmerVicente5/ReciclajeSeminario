import { useState, useEffect } from "react";
import { fetchApi } from "../services/api";

const useRanking = () => {
  const [ranking, setRanking] = useState({ count: 0, data: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarRanking = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchApi("/api/ranking");
      setRanking(res.data); // Ajuste: res.data contiene el objeto con count y data
    } catch (err) {
      console.error("Error al cargar ranking:", err);
      setError("Error al cargar ranking.");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarRanking();
  }, []);

  return { ranking, loading, error };
};

export default useRanking;