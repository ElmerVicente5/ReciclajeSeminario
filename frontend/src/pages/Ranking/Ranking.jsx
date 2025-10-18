import styles from "./Ranking.module.css";
import { FaMedal } from "react-icons/fa";
import useRanking from "../../hooks/useRanking";
import { Table } from "react-bootstrap";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32", "#d42d2dff", "#d42d2dff"];

export default function Ranking() {
  const { ranking, loading, error } = useRanking();

  const tableStyles = {
    fontSize: "12px", // Ajustar el tamaño de fuente a 12px
    textAlign: "center",
  };

  const headerStyles = {
    fontSize: "14px", // Reducir el tamaño del título y encabezados
    textAlign: "center",
  };

  const numberStyles = {
    fontWeight: "normal", // Quitar el estilo bold para los números
    textAlign: "center",
  };

  return (
    <div className="container py-4">
      <div className={styles.card} style={{ position: "relative" }}>
        <LoadingOverlay loading={loading} error={error} />
        <div className={styles.tableHeader} style={headerStyles}>
          🏅 Ranking por Zona
        </div>
        <div className="table-responsive">
          {console.log("Ranking data:", ranking.data)}
          <Table
            striped
            bordered
            hover
            size="sm"
            className="bg-white rounded"
            style={tableStyles}
          >
            <thead className={styles.rankingTableHeader}>
              <tr>
                <th style={headerStyles}>#</th>
                <th style={headerStyles}>Zona</th>
                <th style={headerStyles}>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.data.map((zona, index) => (
                <tr key={zona.zona_id || zona.zona} style={tableStyles}>
                  <td style={numberStyles}>
                    <FaMedal color={medalColors[index]} style={{ marginRight: 4 }} />
                    {index + 1}
                  </td>
                  <td>{zona.zona}</td>
                  <td>
                    {zona.total_puntos !== undefined ? zona.total_puntos : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
