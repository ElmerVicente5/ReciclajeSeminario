// Hook personalizado para manejar la lógica de login usando authService.js
import { useState } from "react";
import { login as authLogin } from "../services/authService";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async ({ email, password }) => {
    setLoading(true);
    setError("");
    try {
      const result = await authLogin({ email, password });
      setLoading(false);
      if (!result.success) {
        setError("Credenciales incorrectas");
      }
      return result;
    } catch (err) {
      setLoading(false);
      setError("Error de conexión o backend no disponible");
      return { success: false };
    }
  };

  return { login, loading, error };
}
