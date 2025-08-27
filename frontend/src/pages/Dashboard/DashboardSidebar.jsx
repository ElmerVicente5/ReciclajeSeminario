import styles from "./DashboardSidebar.module.css";
import {
  FaRecycle,
  FaHome,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChartBar,
  FaFileAlt,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
export default function DashboardSidebar() {
  const navigate = useNavigate();
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoGroup}>
        <img src={logo} alt="Logo Municipalidad" className={styles.logoImg} />
      </div>
      <span className={styles.logoText}>Panel Municipal</span>
      <nav className={styles.menu}>
        <button
          className={styles.menuItem}
          title="Dashboard"
          onClick={() => navigate("/dashboard")}
        >
          <FaHome className={styles.menuIcon} /> Dashboard
        </button>
        <button className={styles.menuItem} title="Calendario y Rutas">
          <FaCalendarAlt className={styles.menuIcon} /> Calendario y Rutas
        </button>
        <button
          className={styles.menuItem}
          title="Puntos de Acopio"
          onClick={() => navigate("/mapa")}
        >
          <FaMapMarkerAlt className={styles.menuIcon} /> Puntos de Acopio
        </button>
        <button className={styles.menuItem} title="Ranking por Colonia">
          <FaChartBar className={styles.menuIcon} /> Ranking por Colonia
        </button>
        <button className={styles.menuItem} title="Reportes">
          <FaFileAlt className={styles.menuIcon} /> Reportes
        </button>
        <button className={styles.menuItem} title="Configuración">
          <FaCog className={styles.menuIcon} /> Configuración
        </button>
        <button
          className={styles.menuItem}
          title="Cerrar sesión"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            navigate("/login");
          }}
        >
          <FaRecycle className={styles.menuIcon} /> Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}
