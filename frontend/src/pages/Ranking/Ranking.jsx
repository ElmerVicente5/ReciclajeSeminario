import styles from "./Ranking.module.css";
import { FaMedal } from "react-icons/fa";
import useRanking from "../../hooks/useRanking";
import { Table } from "react-bootstrap";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32", "#d42d2dff", "#d42d2dff"];

export default function Ranking() {
  const { ranking, loading, error } = useRanking();

  return (
    <div className="container py-4">
      <div className={styles.card} style={{ position: "relative" }}>
        <LoadingOverlay loading={loading} error={error} />
        <div className={styles.tableHeader}>🏅 Ranking por Zona</div>
        <div className="table-responsive">
          {console.log("Ranking data:", ranking.data)}
          <Table striped bordered hover size="sm" className="bg-white rounded">
            <thead className={styles.rankingTableHeader}>
              <tr>
                <th>#</th>
                <th>Zona</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.data.map((zona, index) => (
                <tr key={zona.zona_id || zona.zona}>
                  <td>
                    <FaMedal color={medalColors[index]} style={{ marginRight: 4 }} />
                    {index + 1}
                  </td>
                  <td>{zona.zona}</td>
                  <td style={{ textAlign: "right" }}>
                    {zona.total_puntos !== undefined
                      ? zona.total_puntos
                      : "-"}
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
                 