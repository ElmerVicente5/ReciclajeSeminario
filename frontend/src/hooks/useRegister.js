import { useState } from "react";
import { fetchApi } from "../services/api";

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async ({ nombreCompleto, nombreUsuario, contrasenia }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchApi("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ nombreCompleto, nombreUsuario, contrasenia }),
      });
      setLoading(false);
      if (res.success) return { success: true, user: res.user };
      setError(res.message || "Error en el registro.");
      return { success: false };
    } catch (err) {
      setLoading(false);
      setError("No se pudo conectar al servidor.");
      return { success: false };
    }
  };

  return { register, loading, error };
};