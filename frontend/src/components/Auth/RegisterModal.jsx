import { useState, useEffect } from "react";
import styles from "./LoginForm.module.css";
import { validateEmail, validateStrongPassword, validateName, validateRequired } from "../../utils/validation";

export default function RegisterModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  // Limpiar campos al abrir/cerrar el modal
  useEffect(() => {
    if (!open) {
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess(false);
      setShowPassword(false);
      setShowConfirm(false);
    }
  }, [open]);

  if (!open) return null;


  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    // Validaciones
    if (!name || !email || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido que termine en .com");
      return;
    }
    if (name.length < 3) {
      setError("El nombre debe tener al menos 3 caracteres.");
      return;
    }
<<<<<<< HEAD
    if (!validateStrongPassword(password)) {
      setError("La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo.");
=======
    // Contraseña: mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número y un símbolo
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y símbolo.",
      );
>>>>>>> 7d333a393bdea7757cfa91362648dd5356ad8d66
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
      if (!validateRequired(name) || !validateRequired(email) || !validateRequired(password) || !validateRequired(confirmPassword)) {
        setError("Todos los campos son obligatorios.");
        return;
      }
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
<<<<<<< HEAD
=======
        <button className={styles.closeBtn} onClick={onClose}>
          &times;
        </button>
>>>>>>> 7d333a393bdea7757cfa91362648dd5356ad8d66
        <h2 className={styles.title}>Registro</h2>
        {success ? (
          <div className={styles.successMsg}>¡Registro exitoso!</div>
        ) : (
<<<<<<< HEAD
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                title="Completa este campo"
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                title="Completa este campo"
              />
            </div>
            <div className={styles.inputGroup} style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.passwordInput}
                style={{ width: "100%" }}
                title="Completa este campo"
              />
              <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)" }}>
=======
          <form className={`container ${styles.form}`} onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-12">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-12">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="row mb-3" style={{ position: "relative" }}>
              <div className="col-12">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                  style={{ width: "100%" }}
                />
                <span
                  style={{
                    position: "absolute",
                    right: 16,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className={styles.showPasswordBtn}
                    tabIndex={-1}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </span>
              </div>
            </div>
            <div className="row mb-3" style={{ position: "relative" }}>
              <div className="col-12">
                <input
                  placeholder="Confirmar contraseña"
                  className={styles.confirmPasswordInput}
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
>>>>>>> 7d333a393bdea7757cfa91362648dd5356ad8d66
                <button
                  type="button"
                  className={styles.confirmShowPasswordBtn}
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? "Ocultar" : "Mostrar"}
                </button>
<<<<<<< HEAD
              </span>
            </div>
            <div className={styles.inputGroup} style={{ position: "relative" }}>
              <input
                placeholder="Confirmar contraseña"
                className={styles.confirmPasswordInput}
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                title="Completa este campo"
              />
              <button
                type="button"
                className={styles.confirmShowPasswordBtn}
                tabIndex={-1}
                onClick={() => setShowConfirm((v) => !v)}
              >
                {showConfirm ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.button} type="submit">Registrarse</button>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <a
                href="#"
                onClick={e => { e.preventDefault(); onClose(); }}
                className={styles.registerLinkBtn}
                style={{ marginTop: 18, display: 'inline-block' }}
              >
                Cancelar
              </a>
            </div>
=======
              </div>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button className={styles.button} type="submit">
              Registrarse
            </button>
>>>>>>> 7d333a393bdea7757cfa91362648dd5356ad8d66
          </form>
        )}
      </div>
    </div>
  );
}
