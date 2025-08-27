import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import PrivateRoute from "./components/Auth/PrivateRoute";
import NotFound from "./pages/NotFound";
import MapLeafletPage from "./pages/MapLeaflet/MapLeafletPage";
import DashboardSidebar from "./pages/Dashboard/DashboardSidebar";

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
      <main style={{ flex: 1 }}>{children}</main>
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
