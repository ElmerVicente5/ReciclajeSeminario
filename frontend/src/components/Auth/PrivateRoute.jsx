import { Navigate } from "react-router-dom";

// Simulación de autenticación
function isAuthenticated() {
	// localStorage, contexto, etc.
	return localStorage.getItem("isLoggedIn") === "true";
}

export default function PrivateRoute({ children }) {
	if (!isAuthenticated()) {
		return <Navigate to="/login" replace />;
	}
	return children;
}
