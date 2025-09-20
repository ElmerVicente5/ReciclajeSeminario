import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import DashboardSidebar from "./DashboardSidebar";
import { FaUser, FaBell, FaChartLine, FaMapMarkerAlt, FaRoute, FaWarehouse } from "react-icons/fa";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";
import { isAuthenticated } from "../../services/api";
import { useDashboard } from "../../hooks/useDashboard";

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

  if (loading) return <div>Cargando dashboard...</div>;
  if (error) return <div>{error}</div>;
  if (!dashboardData) return null;

  // Datos de residuos
  const residuosLabels = dashboardData.tipos_residuos?.map(r => r.categoria) || [];
  const residuosData = dashboardData.tipos_residuos?.map(r => r.cantidad) || [];

  // Datos de zonas
  const zonasLabels = dashboardData.zonas?.map(z => z.zonas.nombre) || [];
  const zonasData = dashboardData.zonas?.map(z => z.puntos) || [];

  // Zona con más puntos
  const zonaTop = dashboardData.zonas?.length
    ? dashboardData.zonas.reduce((prev, curr) => (prev.puntos > curr.puntos ? prev : curr))
    : null;

  const handleFilter = () => refresh();

  return (
    <div className={styles.dashboardContainer}>
      <DashboardSidebar onLogout={handleLogout} />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Actividad en el sistema</h1>

        {/* Filtros de fecha */}
        <div className={styles.filterContainer}>
          <label className={styles.dateLabel}>
            Fecha inicio:
            <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} className={styles.dateInput} />
          </label>
          <label className={styles.dateLabel}>
            Fecha fin:
            <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)} className={styles.dateInput} />
          </label>
          <button onClick={handleFilter} className={styles.filterButton}>Filtrar</button>
        </div>

        {/* Tarjetas métricas */}
        <div className={styles.cardsGrid}>
          <div className={styles.card}>
            <FaUser size={28} color="#2196f3" />
            <div>
              <div className={styles.cardValue}>{dashboardData.usuarios?.total ?? 0}</div>
              <div className={styles.cardLabel}>Usuarios Totales</div>
            </div>
          </div>

          <div className={styles.card}>
            <FaChartLine size={28} color="#1bb934" />
            <div>
              <div className={styles.cardValue}>{dashboardData.notificaciones?.enviadas ?? 0}</div>
              <div className={styles.cardLabel}>Notificaciones Enviadas</div>
            </div>
          </div>

          <div className={styles.card}>
            <FaBell size={28} color="#ffca28" />
            <div>
              <div className={styles.cardValue}>{dashboardData.notificaciones?.pendientes ?? 0}</div>
              <div className={styles.cardLabel}>Notificaciones Pendientes</div>
            </div>
          </div>

          <div className={styles.card}>
            <FaMapMarkerAlt size={28} color="#ff7043" />
            <div>
              {zonaTop ? (
                <>
                  <div className={styles.cardValue}>{zonaTop.zonas.nombre}</div>
                  <div className={styles.cardLabel}>Zona con más puntos ({zonaTop.puntos})</div>
                </>
              ) : (
                <>
                  <div className={styles.cardValue}>N/A</div>
                  <div className={styles.cardLabel}>No hay datos en este rango</div>
                </>
              )}
            </div>
          </div>

          <div className={styles.card}>
            <FaWarehouse size={28} color="#8e44ad" />
            <div>
              <div className={styles.cardValue}>{dashboardData.centros_acopio ?? 0}</div>
              <div className={styles.cardLabel}>Centros de Acopio</div>
            </div>
          </div>

          <div className={styles.card}>
            <FaRoute size={28} color="#16a085" />
            <div>
              <div className={styles.cardValue}>{dashboardData.rutas ?? 0}</div>
              <div className={styles.cardLabel}>Rutas</div>
            </div>
          </div>
        </div>

        {/* Gráficas */}
        <div className={styles.chartsGrid}>
          <div className={styles.chartCard}>
            <h3>Puntos por Zona</h3>
            {zonasLabels.length ? (
              <Bar
              className={styles.barChartCanvas} 
                data={{
                  labels: zonasLabels,
                  datasets: [{
                    label: "Puntos",
                    data: zonasData,
                    backgroundColor: ["#2196f3","#168126ff","#ffd969ff"],
                    borderRadius: 6,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { x: { grid: { display: false } }, y: { beginAtZero: true, grid: { display: false } } },
                }}
                height={120}
              />
            ) : (
              <p className={styles.noData}>No hay datos para mostrar</p>
            )}
          </div>

          <div className={styles.chartCard}>
            <h3>Total Clasificación de residuos por categoría</h3>
            {residuosLabels.length ? (
              <Doughnut
              className={styles.doughnutChartCanvas} 
                data={{
                  labels: residuosLabels,
                  datasets: [{
                    label: "Cantidad",
                    data: residuosData,
                    backgroundColor: ["#66bb6a","#81c784","#a5d6a7","#c8e6c9"],
                    borderWidth: 2,
                  }],
                }}
                options={{ responsive: true, plugins: { legend: { position: "bottom" }, tooltip: { enabled: true } } }}
              />
            ) : (
              <p className={styles.noData}>No hay datos para mostrar</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
