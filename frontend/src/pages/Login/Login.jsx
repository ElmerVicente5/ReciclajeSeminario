// Página de login para la plataforma web de reciclaje inteligente
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/Auth/LoginForm";
import styles from "./Login.module.css";

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
    <div className={styles.loginBg}>
      <div className={styles.loginContainer}>
        {success && (
          <div className={styles.loginSuccess}>¡Inicio de sesión exitoso!</div>
        )}
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
