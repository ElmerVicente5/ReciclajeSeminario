import styles from "./DashboardSidebar.module.css";
import {
  FaRecycle,
  FaHome,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import { useState } from "react";

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const [menuOpen, setMenuOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        {/* Botón hamburguesa flotante */}
        <button
          className="btn btn-success rounded-circle shadow-lg"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 300,
            width: 56,
            height: 56,
            display: menuOpen ? "none" : "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 28,
          }}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menú"
        >
          <FaBars />
        </button>
        {/* Menú expandible inferior */}
        {menuOpen && (
          <nav
            className="d-flex flex-row align-items-center justify-content-between w-100 px-2 py-2 bg-success animate__animated animate__slideInUp"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              height: 72,
              zIndex: 400,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              boxShadow: "0 -2px 12px #0002",
              transition: "all 0.3s",
            }}
          >
            <button
              className="btn btn-link text-white"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              <FaTimes size={28} />
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Dashboard"
              onClick={() => {
                setMenuOpen(false);
                navigate("/dashboard");
              }}
            >
              <FaHome size={22} />{" "}
              <span style={{ fontSize: 10 }}>Dashboard</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Calendario y Rutas"
              onClick={() => {
                setMenuOpen(false);
                navigate("/calendario");
              }}
            >
              <FaCalendarAlt size={22} />{" "}
              <span style={{ fontSize: 10 }}>Calendario</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Puntos de Acopio"
              onClick={() => {
                setMenuOpen(false);
                navigate("/mapa");
              }}
            >
              <FaMapMarkerAlt size={22} />{" "}
              <span style={{ fontSize: 10 }}>Acopio</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Ranking por Colonia"
            >
              <FaChartBar size={22} />{" "}
              <span style={{ fontSize: 10 }}>Ranking</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Reportes"
            >
              <FaFileAlt size={22} />{" "}
              <span style={{ fontSize: 10 }}>Reportes</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Configuración"
            >
              <FaCog size={22} /> <span style={{ fontSize: 10 }}>Config</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Cerrar sesión"
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                setMenuOpen(false);
                navigate("/login");
              }}
            >
              <FaRecycle size={22} />{" "}
              <span style={{ fontSize: 10 }}>Salir</span>
            </button>
          </nav>
        )}
      </>
    );
  }

  // Sidebar vertical en escritorio
  return (
    <aside
      className={`${styles.sidebar} d-flex flex-column align-items-center py-3 px-2`}
    >
      <div className="row w-100 mb-2">
        <div className="col-12 d-flex justify-content-center">
          <img src={logo} alt="Logo Municipalidad" className={styles.logoImg} />
        </div>
      </div>
      <span className={`${styles.logoText} mb-3 text-center w-100`}>
        Panel Municipal
      </span>
      <nav className={`${styles.menu} w-100`}>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Dashboard"
          onClick={() => navigate("/dashboard")}
        >
          {" "}
          <FaHome className={styles.menuIcon} /> Dashboard{" "}
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Calendario y Rutas"
          onClick={() => navigate("/calendario")}
        >
          {" "}
          <FaCalendarAlt className={styles.menuIcon} /> Calendario y Rutas{" "}
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Puntos de Acopio"
          onClick={() => navigate("/mapa")}
        >
          {" "}
          <FaMapMarkerAlt className={styles.menuIcon} /> Puntos de Acopio{" "}
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Ranking por Colonia"
        >
          {" "}
          <FaChartBar className={styles.menuIcon} /> Ranking por Colonia{" "}
        </button>
        <button className={`${styles.menuItem} w-100 mb-2`} title="Reportes">
          {" "}
          <FaFileAlt className={styles.menuIcon} /> Reportes{" "}
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Configuración"
        >
          {" "}
          <FaCog className={styles.menuIcon} /> Configuración{" "}
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Cerrar sesión"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            navigate("/login");
          }}
        >
          {" "}
          <FaRecycle className={styles.menuIcon} /> Cerrar sesión{" "}
        </button>
      </nav>
    </aside>
  );
}
