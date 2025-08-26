
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import styles from "./LoginForm.module.css";
import RecoverPasswordModal from "./RecoverPasswordModal";


export default function LoginForm({ onLogin }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showRecover, setShowRecover] = useState(false);
	const { login, loading, error } = useLogin();
	const [localError, setLocalError] = useState("");

	const validateEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLocalError("");
			if (!validateEmail(email)) {
				setLocalError("Por favor ingresa un correo electrónico válido.");
				return;
			}
			if (!password) {
				setLocalError("Por favor ingresa tu contraseña.");
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

	return (
		<>
			<form className={styles.form} onSubmit={handleSubmit}>
				<h2 className={styles.title}>Clasifica tu basura de forma inteligente</h2>
				<div className={styles.inputGroup}>
											<div style={{ marginBottom: 4 }}><strong>Correo</strong></div>
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
				<div className={styles.inputGroup}>
											<div style={{ marginBottom: 4 }}><strong>Contraseña</strong></div>
											<div style={{ position: "relative" }}>
															<input
																type={showPassword ? "text" : "password"}
																value={password}
																onChange={(e) => setPassword(e.target.value)}
																style={{ paddingRight: 70 }}
																placeholder="Contraseña"
																title="Completa este campo"
															/>
												<button
													type="button"
													onClick={() => setShowPassword((v) => !v)}
													style={{
														position: "absolute",
														right: 8,
														top: "50%",
														transform: "translateY(-50%)",
														background: "none",
														border: "none",
														cursor: "pointer",
														color: "#2563eb",
														fontSize: 14,
														fontWeight: 500
													}}
													tabIndex={-1}
												>
													{showPassword ? "Ocultar" : "Mostrar"}
												</button>
											</div>
					<div style={{ textAlign: "right", marginTop: 4 }}>
						<button
							type="button"
							style={{ color: "#2563eb", fontSize: 13, textDecoration: "underline", cursor: "pointer", background: "none", border: "none", padding: 0 }}
							onClick={() => setShowRecover(true)}
						>
							¿Olvidaste tu contraseña?
						</button>
					</div>
				</div>
						{(localError || error) && (
							<div className={styles.error}>
								{localError || error}
							</div>
						)}
				<button className={styles.button} type="submit" disabled={loading}>
					{loading ? "Ingresando..." : "Ingresar"}
				</button>
			</form>
			<RecoverPasswordModal open={showRecover} onClose={() => setShowRecover(false)} />
		</>
	);
}
