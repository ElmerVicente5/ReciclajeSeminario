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
  FaUser,
  FaBell,
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";

export default function DashboardSidebar() {
  const navigate = useNavigate();
  const isMobile = window.matchMedia("(max-width: 900px)").matches;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigation = (path) => {
    navigate(path);
  };

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
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Usuarios y Roles"
              onClick={() => {
                setMenuOpen(false);
                handleNavigation("/usuarios");
              }}
            >
              <FaUser size={22} />
              <span style={{ fontSize: 10 }}> Usuarios</span>
            </button>
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
                handleNavigation("/dashboard");
              }}
            >
              <FaHome size={22} />{" "}
              <span style={{ fontSize: 10 }}> Dashboard</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Calendario y Rutas"
              onClick={() => {
                setMenuOpen(false);
                handleNavigation("/calendario");
              }}
            >
              <FaCalendarAlt size={22} />{" "}
              <span style={{ fontSize: 10 }}> Calendario</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Puntos de Acopio"
              onClick={() => {
                setMenuOpen(false);
                handleNavigation("/mapa");
              }}
            >
              <FaMapMarkerAlt size={22} />{" "}
              <span style={{ fontSize: 10 }}> Acopio</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Ranking por Colonia"
              onClick={() => {
                setMenuOpen(false);
                handleNavigation("/ranking");
              }}
            >
              <FaChartBar size={22} />
              <span style={{ fontSize: 10 }}> Ranking</span>
            </button>
            <button
              className="btn btn-link text-white d-flex flex-column align-items-center"
              title="Reportes"
            >
              <FaFileAlt size={22} />{" "}
              <span style={{ fontSize: 10 }}> Reportes</span>
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
                handleNavigation("/login");
              }}
            >
              <FaRecycle size={22} />{" "}
              <span style={{ fontSize: 10 }}> Salir</span>
            </button>
          </nav>
        )}
      </>
    );
  }

  // Sidebar vertical en escritorio
  return (
    <aside
      className={`${styles.sidebar} d-flex flex-column align-items-center py-3 px-2 animate__animated animate__fadeInLeft`}
      style={{
        minHeight: "100vh",
        height: "100vh",
        position: "sticky",
        top: 0,
        left: 0,
        zIndex: 100,
        background: "#fff",
      }}
    >
      <div className="w-100 mb-2">
        <div className="d-flex justify-content-center">
          <img
            src={logo}
            alt="Logo Municipalidad"
            className={styles.logoImg}
          />
        </div>
      </div>
      <span className={`${styles.logoText} mb-3 text-center w-100`}>
        Panel Municipal
      </span>
      <nav className={`${styles.menu} w-100`}>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Usuarios y Roles"
          onClick={() => handleNavigation("/usuarios")}
        >
          <FaUser className={styles.menuIcon} /> <span>Usuarios y Roles</span>
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Dashboard"
          onClick={() => {
            handleNavigation("/dashboard");
          }}
        >
          <FaHome className={styles.menuIcon} /> <span>Dashboard</span>
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Calendario y Rutas"
          onClick={() => {
            handleNavigation("/calendario");
          }}
        >
          <FaCalendarAlt className={styles.menuIcon} /> <span>Calendario y Rutas</span>
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Puntos de Acopio"
          onClick={() => {
            handleNavigation("/mapa");
          }}
        >
          <FaMapMarkerAlt className={styles.menuIcon} /> <span>Puntos de Acopio</span>
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Ranking por Colonia"
          onClick={() => {
            handleNavigation("/ranking");
          }}
        >
          <FaChartBar className={styles.menuIcon} /> <span>Ranking por Colonia</span>
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Reportes"
          onClick={() => {
            handleNavigation("/reportes");
          }}
        >
          <FaFileAlt className={styles.menuIcon} /> <span>Reportes</span>
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Configuración"
          onClick={() => {
            handleNavigation("/configuracion");
          }}
        >
          <FaCog className={styles.menuIcon} /> <span>Configuración</span>
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Notificaciones"
          onClick={() => {
            handleNavigation("/notificaciones");
          }}
        >
          <FaBell className={styles.menuIcon} /> <span>Notificaciones</span>
        </button>
        <button
          className={`${styles.menuItem} w-100 mb-2`}
          title="Cerrar sesión"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            handleNavigation("/login");
          }}
        >
          <FaRecycle className={styles.menuIcon} /> <span>Cerrar sesión</span>
        </button>
      </nav>
    </aside>
  );
}