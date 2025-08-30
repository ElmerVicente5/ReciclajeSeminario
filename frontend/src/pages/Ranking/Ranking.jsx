import styles from "./Ranking.module.css";
import { FaMedal } from "react-icons/fa";

const topColonias = [
  { id: 1, nombre: "Colonia España", puntos: 1580 },
  { id: 2, nombre: "Colonia San Antonio", puntos: 1420 },
  { id: 3, nombre: "Barrio Monterrey", puntos: 1350 },
  { id: 4, nombre: "Colonia Concepcion", puntos: 1200 },
  { id: 5, nombre: "Colonia San Juan", puntos: 1100 },
];

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32", "#d42d2dff", "#d42d2dff"];

export default function Ranking() {
  return (
    <div className="container py-4">
      <div className={styles.card}>
        <div className={styles.tableHeader}>🏅 Ranking por Colonia </div>
        <div className={styles.tableContainer}>
          {topColonias.map((colonia, index) => (
            <div key={colonia.id} className={styles.tableRow}>
              <div className={styles.cell}>
                <FaMedal color={medalColors[index]} className={styles.icon} />
                {index + 1}
              </div>
              <div className={styles.cell}>{colonia.nombre}</div>
              <div className={styles.cell} style={{ textAlign: "right" }}>
                {colonia.puntos.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
