import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://localhost:8000/api";

export function useDashboard(fechaInicio, fechaFin) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Las fechas de inicio y fin son obligatorias.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró un token de autenticación. Por favor, inicie sesión.");
      }

      if (!token.includes('.') || token.split('.').length !== 3) {
        throw new Error("El token de autenticación no es válido. Inicie sesión nuevamente.");
      }

      // Decodificar el payload para obtener el rol
      let rol = "USER";
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        rol = (payload.rol || payload.role || "USER").toUpperCase();
        console.log("Payload del token:", payload);
        console.log("Rol detectado:", rol);
      } catch (decodeError) {
        console.warn("No se pudo decodificar el token JWT:", decodeError);
      }

      // Usar endpoint /api/dashboard/ (con barra al final) como indica la documentación
      const endpoint = `${API_BASE_URL}/dashboard/?fechaInicio=${encodeURIComponent(fechaInicio)}&fechaFin=${encodeURIComponent(fechaFin)}`;
      console.log("Probando endpoint:", endpoint);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Si da 404, muestra mensaje claro y NO intenta otra ruta
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `El endpoint del dashboard no se encontró (404): ${endpoint}.
Verifica que el backend tenga implementado GET /api/dashboard y que esté corriendo en el puerto 8000.
Si usas Docker, revisa los puertos y la ruta en el backend.`
          );
        }
        if (response.status === 401) {
          throw new Error("No autorizado (401). Verifique su token de autenticación.");
        }
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      // Validar que la respuesta tenga la estructura esperada
      if (
        typeof result !== "object" ||
        !result.usuarios ||
        !result.notificaciones ||
        !Array.isArray(result.zonas) ||
        !Array.isArray(result.tipos_residuos)
      ) {
        throw new Error("La respuesta de la API no tiene la estructura esperada para el dashboard.");
      }
      setData(result);
    } catch (err) {
      setError(err.message || "Error al cargar los datos del dashboard.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refresh = () => {
    fetchDashboardData();
  };

  return { data, loading, error, refresh };
}