import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import DashboardSidebar from "./DashboardSidebar";
import {
  FaRecycle,
  FaUser,
  FaHome,
  FaTrashAlt,
  FaChartLine,
} from "react-icons/fa";
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
import { FiLogOut } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.dashboardContainer}>
      <DashboardSidebar onLogout={handleLogout} />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Panel Municipal</h1>
        <div className={`row ${styles.grid}`}>
          <div className={`col-12 col-md-6 col-lg-4 mb-4 ${styles.card}`}>
            <div className={styles.cardIcon}>
              <FaTrashAlt size={28} color="#16a34a" />
            </div>
            <div>
              <div className={styles.cardValue}>108</div>
              <div className={styles.cardLabel}>Clasificaciones</div>
            </div>
          </div>
          <div className={`col-12 col-md-6 col-lg-4 mb-4 ${styles.card}`}>
            <div className={styles.cardIcon}>
              <FaChartLine size={28} color="#2563eb" />
            </div>
            <div>
              <div className={styles.cardValue}>35%</div>
              <div className={styles.cardLabel}>Participación</div>
            </div>
          </div>
          <div className={`col-12 col-lg-8 mb-4 ${styles.cardFull}`}>
            <div className={styles.cardLabel}>Clasificaciones por Día</div>
            <div style={{ height: 180 }}>
              <Bar
                data={{
                  labels: [
                    "Lun",
                    "Mar",
                    "Mié",
                    "Jue",
                    "Vie",
                    "Sáb",
                    "Dom",
                    "Lun",
                    "Mar",
                    "Mié",
                  ],
                  datasets: [
                    {
                      label: "Clasificaciones",
                      data: [6, 4, 5, 7, 8, 9, 5, 7, 6, 3],
                      backgroundColor: [
                        "#ff3b3f", // rojo vivo
                        "#ffb800", // amarillo
                        "#00d084", // verde
                        "#0096ff", // azul
                        "#ff61a6", // rosa
                        "#00e6e6", // cyan
                        "#ff7f00", // naranja
                        "#a259ff", // violeta
                        "#00c3ff", // azul claro
                        "#ffde59", // amarillo claro
                      ],
                      borderRadius: 6,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { display: false },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      ticks: { color: "#222e3a", font: { size: 12 } },
                    },
                    y: {
                      grid: { display: false },
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                        color: "#222e3a",
                        font: { size: 12 },
                      },
                    },
                  },
                }}
                height={120}
              />
            </div>
          </div>
          <div className={`col-12 col-md-6 col-lg-4 mb-4 ${styles.card}`}>
            <div className={styles.cardLabel}>Residuos Comunes</div>
            <div className={styles.progressGroup}>
              <div className={styles.progressLabel}>Vidito</div>
              <div
                className={styles.progressBar}
                style={{ width: "80%" }}
              ></div>
              <div className={styles.progressLabel}>Plástico</div>
              <div
                className={styles.progressBar}
                style={{ width: "60%" }}
              ></div>
              <div className={styles.progressLabel}>Orgánico</div>
              <div
                className={styles.progressBar}
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>
          <div className={`col-12 col-md-6 col-lg-4 mb-4 ${styles.card}`}>
            <div className={styles.cardLabel}>Puntos de Acopio</div>
            <div className={styles.map}>
              <MapLeaflet />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
