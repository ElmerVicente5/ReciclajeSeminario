import { useState, useEffect } from "react";
import { useLogin } from "../../hooks/useLogin";
import { validateEmail, validateStrongPassword } from "../../utils/validation";
import styles from "./LoginForm.module.css";

import RecoverPasswordModal from "./RecoverPasswordModal";
import RegisterModal from "./RegisterModal";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRecover, setShowRecover] = useState(false);
  const { login, loading, error } = useLogin();
  const [localError, setLocalError] = useState("");
  const [showRegister, setShowRegister] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!validateEmail(email)) {
      setLocalError("Por favor ingresa un correo electrónico válido que termine en .com");
      return;
    }
    if (!password) {
      setLocalError("Por favor ingresa tu contraseña.");
      return;
    }
    if (!validateStrongPassword(password)) {
      setLocalError("La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo.");
      return;
    }
    const result = await login({ email, password });
    if (!result.success) {
      setLocalError("Correo o contraseña incorrectos.");
      return;
    }
    if (onLogin) {
      onLogin(result.user);
    }
  };

  // Limpiar campos de login al cerrar/abrir modales de registro o recuperación
  useEffect(() => {
    if (!showRegister && !showRecover) {
      setEmail("");
      setPassword("");
      setLocalError("");
      setShowPassword(false);
    }
  }, [showRegister, showRecover]);

  return (
    <>
<<<<<<< HEAD
      <form className={styles.form} onSubmit={handleSubmit}>
        <div style={{ background: '#f3f4f6', color: '#222', borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 14, textAlign: 'center' }}>
          <strong>Credenciales de prueba:</strong><br />
          Correo: <span style={{ fontFamily: 'monospace' }}>admin@demo.com</span><br />
          Contraseña: <span style={{ fontFamily: 'monospace' }}>Admin123!</span>
        </div>
=======
      <form className={`container ${styles.form}`} onSubmit={handleSubmit}>
>>>>>>> 7d333a393bdea7757cfa91362648dd5356ad8d66
        <h2 className={styles.title}>
          Clasifica tu basura de forma inteligente
        </h2>
        <div className={`row ${styles.inputGroup}`}>
          <div className="col-12 col-md-4">
            <div className={styles.label}>
              <strong>Correo</strong>
            </div>
          </div>
          <div className="col-12 col-md-8">
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              placeholder="Correo electrónico"
              title="Completa este campo"
            />
          </div>
<<<<<<< HEAD
=======
        </div>
        <div className={`row ${styles.inputGroup}`}>
          <div className="col-12 col-md-4">
            <div className={styles.label}>
              <strong>Contraseña</strong>
            </div>
          </div>
          <div className="col-12 col-md-8">
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.passwordInput}
                placeholder="Contraseña"
                title="Completa este campo"
                style={{ width: "100%", paddingRight: 80 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className={styles.showPasswordBtn}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div className={styles.recoverWrapper}>
              <button
                type="button"
                className={styles.recoverBtn}
                onClick={() => setShowRecover(true)}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>
>>>>>>> 7d333a393bdea7757cfa91362648dd5356ad8d66
        </div>
        {(localError || error) && (
          <div className={styles.error}>{localError || error}</div>
        )}
<<<<<<< HEAD
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <a
            href="#"
            className={styles.registerLinkBtn}
            onClick={e => { e.preventDefault(); setShowRecover(true); }}
            tabIndex={0}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
        <div style={{ textAlign: "center", marginTop: 8 }}>
          <a
            href="#"
            className={styles.registerLinkBtn}
            onClick={e => { e.preventDefault(); setShowRegister(true); }}
            tabIndex={0}
          >
            ¿No tienes cuenta? <span style={{ textDecoration: 'underline' }}>Regístrate</span>
          </a>
        </div>
      </form>
=======
        <div className="row">
          <div className="col-12">
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
        </div>
      </form>
      <div style={{ textAlign: "center", marginTop: 12 }}>
        <button
          type="button"
          style={{
            color: "#2563eb",
            fontSize: 13,
            textDecoration: "underline",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: 0,
            marginRight: 8,
          }}
          onClick={() => setShowRegister(true)}
        >
          ¿No tienes cuenta? Regístrate
        </button>
      </div>
>>>>>>> 7d333a393bdea7757cfa91362648dd5356ad8d66
      <RecoverPasswordModal
        open={showRecover}
        onClose={() => setShowRecover(false)}
      />
      <RegisterModal
        open={showRegister}
        onClose={() => setShowRegister(false)}
      />
    </>
  );
}
