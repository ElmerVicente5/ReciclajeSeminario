// Hook personalizado para manejar la lógica de login
import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async ({ email, password }) => {
    setLoading(true);
    setError("");
    // Simulación de autenticación (reemplazar con llamada a backend cuando esté disponible)
    await new Promise((res) => setTimeout(res, 1000));
    if (email === "admin@demo.com" && password === "Admin123!") {
      setLoading(false);
      return { success: true, user: { email, role: "admin" } };
    } else {
      setLoading(false);
      setError("Credenciales incorrectas");
      return { success: false };
    }
  };

  return { login, loading, error };
}
