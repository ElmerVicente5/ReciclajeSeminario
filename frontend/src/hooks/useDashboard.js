import { useState, useEffect } from "react";
import { fetchApi } from "../services/api"; // puedes crear fetchApi centralizado

export function useDashboard(fechaInicio, fechaFin) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchApi(`/api/dashboard?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
      setData(res);
    } catch (err) {
      setError("No se pudo conectar con la base de datos o el endpoint /api/dashboard no existe.");
      setData(null);
    }
    setLoading(false);
  };

  // Actualiza cuando cambian las fechas
  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line
  }, [fechaInicio, fechaFin]);

  const refresh = () => fetchDashboard();

  return { data, loading, error, refresh };
}
