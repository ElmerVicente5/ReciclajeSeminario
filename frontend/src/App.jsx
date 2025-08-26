
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import PrivateRoute from "./components/Auth/PrivateRoute";
import NotFound from "./pages/NotFound";

function App() {
  
  const isAuthenticated = false; // Cambia a true si el usuario está logueado

  return (
    <BrowserRouter>
      <Routes>
  <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
  <Route path="/" element={<Navigate to="/login" replace />} />
  <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
