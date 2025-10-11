import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import DashboardSidebar from "./DashboardSidebar";
import { FaUser, FaBell, FaChartLine, FaMapMarkerAlt, FaRoute, FaWarehouse } from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { isAuthenticated } from "../../services/api";
import { useDashboard } from "../../hooks/useDashboard";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

// Función para calcular inicio y fin del mes actual
const getCurrentMonthRange = () => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    start: firstDay.toISOString().split("T")[0],
    end: lastDay.toISOString().split("T")[0],
  };
};

export default function Dashboard() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const [fechaInicio, setFechaInicio] = useState(getCurrentMonthRange().start);
  const [fechaFin, setFechaFin] = useState(getCurrentMonthRange().end);

  const { data: dashboardData, loading, error, refresh } = useDashboard(fechaInicio, fechaFin);

  // Elimina los returns que rompen el layout
  // if (error) return <div>{error}</div>;
  // if (!dashboardData) return null;

  // Datos de residuos
  const residuosLabels = dashboardData?.tipos_residuos?.map(r => r.categoria) || [];
  const residuosData = dashboardData?.tipos_residuos?.map(r => r.cantidad) || [];

  // Datos de zonas
  const zonasLabels = dashboardData?.zonas?.map(z => z.zonas.nombre) || [];
  const zonasData = dashboardData?.zonas?.map(z => z.puntos) || [];

  // Zona con más puntos
  const zonaTop = dashboardData?.zonas?.length
    ? dashboardData.zonas.reduce((prev, curr) => (prev.puntos > curr.puntos ? prev : curr))
    : null;

  const handleFilter = () => refresh();
  const colores = [
  "#668cacff", "#168126", "#ffd969", "#dc8064ff", "#dc89ebff",
  "#00bcd4", "#ed734eff", "#4caf50", "#e91e63", "#eec54aff",
  "#434f96ff", "#8bc34a", "#e6be84ff", "#009688", "#cddc39"
];

  return (
    <div className={styles.dashboardContainer}>
      <DashboardSidebar onLogout={handleLogout} />
      <main className={styles.mainContent} style={{ position: "relative" }}>
        <LoadingOverlay loading={loading} error={error} />
        <h1 className={styles.title} style={{ fontSize: "1.1rem", marginBottom: "10px" }}>Actividad en el sistema</h1>
        {/* Filtros de fecha */}
        <div className={styles.filterContainer} style={{ marginBottom: "10px", gap: "8px", padding: "6px 4px" }}>
          <label className={styles.dateLabel} style={{ fontSize: "0.95rem" }}>
            Fecha inicio:
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className={styles.dateInput} style={{ fontSize: "0.92rem", maxWidth: 120, padding: "2px 6px" }} />
          </label>
          <label className={styles.dateLabel} style={{ fontSize: "0.95rem" }}>
            Fecha fin:
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className={styles.dateInput} style={{ fontSize: "0.92rem", maxWidth: 120, padding: "2px 6px" }} />
          </label>
          <button onClick={handleFilter} className={styles.filterButton} style={{ fontSize: "0.95rem", padding: "4px 0", minWidth: 80 }}>Filtrar</button>
        </div>
        {/* Dashboard en 4 componentes compactos */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "10px",
          alignItems: "start",
          marginBottom: "0",
          minHeight: "220px"
        }}>
          {/* Usuarios Totales */}
          <div
            className={styles.card}
            style={{ minWidth: 0, padding: "8px 4px", fontSize: "0.92rem", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/usuarios")}
            title="Ver usuarios"
          >
            <FaUser size={22} color="#2196f3" />
            <div className={styles.cardValue} style={{ fontSize: "1.05rem" }}>
              {dashboardData?.usuarios?.total ?? 0}
            </div>
            <div className={styles.cardLabel} style={{ fontSize: "0.85rem" }}>Usuarios Totales</div>
          </div>
          {/* Notificaciones Enviadas */}
          <div
            className={styles.card}
            style={{ minWidth: 0, padding: "8px 4px", fontSize: "0.92rem", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/notificaciones")}
            title="Ver notificaciones"
          >
            <FaChartLine size={22} color="#1bb934" />
            <div className={styles.cardValue} style={{ fontSize: "1.05rem" }}>
              {dashboardData?.notificaciones?.enviadas ?? 0}
            </div>
            <div className={styles.cardLabel} style={{ fontSize: "0.85rem" }}>Notificaciones Enviadas</div>
          </div>
          {/* Centros de Acopio */}
          <div
            className={styles.card}
            style={{ minWidth: 0, padding: "8px 4px", fontSize: "0.92rem", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/mapa")}
            title="Ver centros de acopio"
          >
            <FaWarehouse size={22} color="#8e44ad" />
            <div className={styles.cardValue} style={{ fontSize: "1.05rem" }}>
              {dashboardData?.centros_acopio ?? 0}
            </div>
            <div className={styles.cardLabel} style={{ fontSize: "0.85rem" }}>Centros de Acopio</div>
          </div>
          {/* Rutas */}
          <div
            className={styles.card}
            style={{ minWidth: 0, padding: "8px 4px", fontSize: "0.92rem", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/calendario")}
            title="Ver rutas"
          >
            <FaRoute size={22} color="#16a085" />
            <div className={styles.cardValue} style={{ fontSize: "1.05rem" }}>
              {dashboardData?.rutas ?? 0}
            </div>
            <div className={styles.cardLabel} style={{ fontSize: "0.85rem" }}>Rutas</div>
          </div>
        </div>
        {/* Segunda fila: 2 gráficos compactos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "18px",
            alignItems: "stretch",
            marginTop: "16px",
            minHeight: "260px"
          }}
        >
          {/* Clasificación de residuos */}
          <div
            className={styles.chartCard}
            style={{
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              borderRadius: 10,
              padding: "18px 12px",
              minWidth: 0,
              maxWidth: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 260
            }}
          >
            <h3 style={{ margin: 0, fontSize: "1.08rem", marginBottom: "12px", fontWeight: 600, color: "#219150" }}>
              Clasificación de residuos
            </h3>
            {residuosLabels.length ? (
              <div style={{ width: "100%", maxWidth: 260, margin: "0 auto" }}>
                <Doughnut
                  data={{
                    labels: residuosLabels,
                    datasets: [{
                      label: "Cantidad",
                      data: residuosData,
                      backgroundColor: ["#fff", "#168126", "#000", "#43ea7c"],
                      borderColor: "#168126",
                      borderWidth: 2,
                    }],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "bottom" } },
                    maintainAspectRatio: false
                  }}
                  style={{ height: 180, width: "100%" }}
                />
              </div>
            ) : (
              <p className={styles.noData}>No hay datos para mostrar</p>
            )}
          </div>
          {/* Puntos por Zona */}
          <div
            className={styles.chartCard}
            style={{
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
              borderRadius: 10,
              padding: "18px 12px",
              minWidth: 0,
              maxWidth: "100%",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 260,
              cursor: "pointer"
            }}
            onClick={() => navigate("/ranking")}
            title="Ver ranking por colonia"
          >
            <h3 style={{ margin: 0, fontSize: "1.08rem", marginBottom: "12px", fontWeight: 600, color: "#1b7bb9" }}>
              Puntos por Zona
            </h3>
            {zonasLabels.length ? (
              <div style={{ width: "100%", maxWidth: 320, margin: "0 auto" }}>
                <Bar
                  data={{
                    labels: zonasLabels,
                    datasets: [{
                      label: "Puntos",
                      data: zonasData,
                      backgroundColor: colores,
                      borderRadius: 6,
                    }],
                  }}
                  options={{
                    indexAxis: "y",
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    maintainAspectRatio: false,
                    scales: {
                      x: { beginAtZero: true, ticks: { font: { size: 13 } } },
                      y: { ticks: { font: { size: 13 } } },
                    },
                  }}
                  style={{ height: 180, width: "100%" }}
                />
              </div>
            ) : (
              <p className={styles.noData}>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}