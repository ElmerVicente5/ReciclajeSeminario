import { useState, useEffect } from "react";
import { fetchApi } from "../services/api"; // puedes crear fetchApi centralizado

export const useDashboard = (fechaInicio, fechaFin) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetchApi(`/api/dashboard?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res);
    } catch (err) {
      setError("No se pudo cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [fechaInicio, fechaFin]);

  return { data, loading, error, refresh: fetchDashboard };
};
