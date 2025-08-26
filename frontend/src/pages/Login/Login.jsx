// Página de login para la plataforma web de reciclaje inteligente
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/Auth/LoginForm";

export default function Login() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (user) => {
    setSuccess(true);
    // Guardar estado de login en localStorage
    localStorage.setItem("isLoggedIn", "true");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1200); // Espera 1.2s para mostrar el mensaje de éxito
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {success && (
          <div style={{
            background: "#16a34a",
            color: "#fff",
            borderRadius: 8,
            padding: "1rem",
            marginBottom: 16,
            textAlign: "center",
            fontWeight: 500,
            fontSize: "1.1rem"
          }}>
            ¡Inicio de sesión exitoso!
          </div>
        )}
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
