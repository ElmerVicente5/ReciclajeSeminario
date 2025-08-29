import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import PrivateRoute from "./components/Auth/PrivateRoute";
import NotFound from "./pages/NotFound";
<<<<<<< HEAD

function App() {
  const isAuthenticated = false; // Cambia a true si el usuario está logueado

  return (
    <>
      {/* Fondo con imagen y overlay */}

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
=======
import MapLeafletPage from "./pages/MapLeaflet/MapLeafletPage";
import DashboardSidebar from "./pages/Dashboard/DashboardSidebar";
import Calendar from "./pages/Calendar/Calendar";

function App() {
  // Layout que incluye el sidebar/navbar
  const Layout = ({ children }) => (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--color-bg, #f3f4f6)",
      }}
    >
      <DashboardSidebar />
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {children}
      </div>
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/mapa"
          element={
            <Layout>
              <MapLeafletPage />
            </Layout>
          }
        />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
        <Route
          path="/calendario"
          element={
            <Layout>
              <Calendar />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
>>>>>>> 7d333a393bdea7757cfa91362648dd5356ad8d66
  );
}

export default App;
