import { useState } from "react";
import { fetchApi } from "../services/api";

export const useCalendario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCalendario = async (zona, fecha) => {
    setLoading(true);
    setError("");
    try {
      // Envía los parámetros como query string
      const data = await fetchApi(
        `/api/calendario${encodeURIComponent(zona)}&fecha=${encodeURIComponent(fecha)}`
      );
      setLoading(false);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      setError("Error al cargar calendario: " + err.message);
      setLoading(false);
      return [];
    }
  };

  return { getCalendario, loading, error };
};