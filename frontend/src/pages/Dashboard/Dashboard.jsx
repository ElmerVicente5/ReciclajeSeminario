import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { FaTrashAlt, FaChartLine } from "react-icons/fa";
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
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
import DashboardSidebar from "./DashboardSidebar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function Dashboard() {
  // Helper para obtener color CSS variable
  const getCssVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name) ||
    undefined;

  // Colores para iconos
  const iconGreen = getCssVar("--color-primary-green") || "#16a34a";
  const iconBlue = getCssVar("--color-primary-blue") || "#2563eb";

  // Colores para gráfico
  const chartColors = [
    getCssVar("--color-accent-red") || "#ff3b3f",
    getCssVar("--color-accent-yellow") || "#ffb800",
    getCssVar("--color-accent-green") || "#00d084",
    getCssVar("--color-primary-blue") || "#0096ff",
    getCssVar("--color-accent-pink") || "#ff61a6",
    getCssVar("--color-accent-cyan") || "#00e6e6",
    getCssVar("--color-accent-orange") || "#ff7f00",
    getCssVar("--color-accent-violet") || "#a259ff",
    getCssVar("--color-accent-light-blue") || "#00c3ff",
    getCssVar("--color-accent-light-yellow") || "#ffde59",
  ];

  return (
    <div className={styles.dashboardContainer}>
      <DashboardSidebar />
      <main className={styles.mainContent}>
        <h1 className={styles.title}>Panel Municipal</h1>
        <div className={`row ${styles.grid}`}>
          <div className={`col-12 col-md-6 col-lg-4 mb-4 ${styles.card}`}>
            <div className={styles.cardIcon}>
              <FaTrashAlt size={28} color={iconGreen} />
            </div>
            <div>
              <div className={styles.cardValue}>108</div>
              <div className={styles.cardLabel}>Clasificaciones</div>
            </div>
          </div>
          <div className={`col-12 col-md-6 col-lg-4 mb-4 ${styles.card}`}>
            <div className={styles.cardIcon}>
              <FaChartLine size={28} color={iconBlue} />
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
                      backgroundColor: chartColors,
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
                      ticks: {
                        color: getCssVar("--color-text") || "#222e3a",
                        font: { size: 12 },
                      },
                    },
                    y: {
                      grid: { display: false },
                      beginAtZero: true,
                      ticks: {
                        stepSize: 1,
                        color: getCssVar("--color-text") || "#222e3a",
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
