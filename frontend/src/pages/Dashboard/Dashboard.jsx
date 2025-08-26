// Página temporal de dashboard para mostrar acceso exitoso
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("isLoggedIn");
		navigate("/login");
	};

	return (
		<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" }}>
			<div style={{ textAlign: "center" }}>
				<h1 style={{ fontSize: "2rem", color: "#16a34a" }}>¡Bienvenido al Dashboard!</h1>
				<p style={{ fontSize: "1.1rem", color: "#222" }}>Has iniciado sesión correctamente.</p>
				<button
					onClick={handleLogout}
					style={{
						marginTop: 32,
						background: "#ef4444",
						color: "#fff",
						border: "none",
						borderRadius: 6,
						padding: "0.7rem 1.5rem",
						fontSize: "1rem",
						fontWeight: 500,
						cursor: "pointer",
						transition: "background 0.2s"
					}}
				>
					Cerrar sesión
				</button>
			</div>
		</div>
	);
}
