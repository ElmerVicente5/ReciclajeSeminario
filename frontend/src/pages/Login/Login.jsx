// Página de login para la plataforma web de reciclaje inteligente
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/Auth/LoginForm";
import styles from "./Login.module.css";

export default function Login() {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Logout automático al acceder a la página de login
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      localStorage.removeItem("isLoggedIn");
    }
  }, []);

  const handleLogin = (user) => {
    setSuccess(true);
    // Guardar estado de login en localStorage
    localStorage.setItem("isLoggedIn", "true");
    setTimeout(() => {
      navigate("/dashboard");
    }, 1200); // Espera 1.2s para mostrar el mensaje de éxito
  };

  return (
    <div className={styles.loginPage}> {/* Clase para dividir la pantalla */}
      <div className={styles.loginBg}> {/* Fondo de los botes */}
        <img
          src="/logoMuni.png"
          alt="Logo Municipalidad"
          className={styles.loginLogoMuni}
        />
        <img
          src="/LogoUMG.png"
          alt="Logo UMG"
          className={styles.loginLogoUMG}
        />
      </div>
      <div className={styles.loginContainer}> {/* Card del login */}
        {success && (
          <div className={styles.loginSuccess}>¡Inicio de sesión exitoso!</div>
        )}
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
