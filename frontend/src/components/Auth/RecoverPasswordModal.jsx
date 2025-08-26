import { useState } from "react";

export default function RecoverPasswordModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo válido.");
      return;
    }
    if (newPassword.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    // lógica real de cambio de contraseña
    setSuccess(true);
    setTimeout(() => {
      onClose();
      setSuccess(false);
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    }, 5000); // 5 segundos
  };

  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(0,0,0,0.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 10,
        padding: "2rem 1.5rem",
        minWidth: 320,
        boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
        textAlign: "center"
      }}>
        <h3 style={{ fontSize: "1.2rem", marginBottom: 16 }}>Restablecer contraseña</h3>
        {success ? (
          <div style={{ color: "#16a34a", fontWeight: 500, margin: "1.5rem 0" }}>
            ¡Contraseña actualizada correctamente!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: "1rem",
                  background: "#f9f9f9"
                }}
              />
            </div>
            <div style={{ marginBottom: 10, position: "relative" }}>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Nueva contraseña"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: "1rem",
                  background: "#f9f9f9"
                }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: 13,
                  cursor: "pointer"
                }}
                tabIndex={-1}
                aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showNewPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div style={{ marginBottom: 10, position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  border: "1px solid #d1d5db",
                  borderRadius: 6,
                  fontSize: "1rem",
                  background: "#f9f9f9"
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontSize: 13,
                  cursor: "pointer"
                }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showConfirmPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 10 }}>{error}</div>}
            <button
              type="submit"
              style={{
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "0.7rem 1.5rem",
                fontSize: "1rem",
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Restablecer
            </button>
          </form>
        )}
        <button
          onClick={onClose}
          style={{
            marginTop: 18,
            background: "none",
            border: "none",
            color: "#2563eb",
            fontSize: 15,
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
