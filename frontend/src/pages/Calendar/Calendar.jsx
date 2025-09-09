import styles from "./Calendar.module.css";
import { Table } from "react-bootstrap";
import { FaUser, FaTruck } from "react-icons/fa";
import CalendarWidget from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState, useEffect } from "react";
import { useCalendario } from "../../hooks/useCalendario";

export default function Calendar() {
  const [date, setDate] = useState(new Date());
  const [calendario, setCalendario] = useState([]);
  const { getCalendario, loading, error } = useCalendario();

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getCalendario();
        setCalendario(Array.isArray(data) ? data : []);
      } catch (err) {
        setCalendario([]);
      }
    };
    cargar();
  }, []);

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return (
    <div className={`container-fluid px-2 px-md-4 py-3`}>
      {error && (
        <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
      )}
      {loading && (
        <div style={{ marginBottom: 16 }}>Cargando calendario...</div>
      )}
      <div className="row g-4">
        <div className="col-12 col-md-6">
          <div className={styles.card}>
            <div className={styles.headerRow}>
              <h2 className={styles.title}>Calendario</h2>
              <div className={styles.filters}>
                <select className={styles.filter}>
                  <option>Zona</option>
                  <option>Todas</option>
                </select>
                <select className={styles.filter}>
                  <option>Categoría</option>
                  <option>Todas</option>
                </select>
                <select className={styles.filter}>
                  <option>Frecuencia</option>
                  <option>Semanal</option>
                </select>
              </div>
            </div>
            <div className={`${styles.calendarRow} d-flex flex-wrap`}>
              <div className={`${styles.calendarBox} flex-grow-1 mb-3 mb-md-0`}>
                <div className={styles.yearNav}></div>
                <div className={styles.monthLabel}>
                  {date.toLocaleString("es-ES", { month: "long" })}
                </div>
                <div style={{ marginBottom: 12 }}>
                  <CalendarWidget
                    onChange={setDate}
                    value={date}
                    locale="es-ES"
                    className={styles.reactCalendar}
                  />
                </div>
                <div className={styles.recoleccionInfo}>
                  <span>
                    Días con recolección <b>19</b>
                  </span>
                  <span className={styles.noRecolect}>
                    Días sin recolección <b>8</b>
                  </span>
                </div>
                {/* Tabla de calendario de recolección */}
                <div className="table-responsive mt-3">
                  <Table striped bordered hover size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>Ruta</th>
                        <th>Día</th>
                        <th>Hora inicio</th>
                        <th>Hora fin</th>
                        <th>Frecuencia</th>
                        <th>Notas</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calendario.map((c) => (
                        <tr key={c.id}>
                          <td>{c.ruta_id}</td>
                          <td>{diasSemana[c.dia_semana]}</td>
                          <td>{c.hora_inicio}</td>
                          <td>{c.hora_fin}</td>
                          <td>{c.frecuencia}</td>
                          <td>{c.notas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className={`${styles.metricsBox} flex-shrink-1 ms-md-4`}>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>247</div>
                  <div className={styles.metricLabel}>Total recolecciones</div>
                </div>
                <div className={styles.leyendaBox}>
                  <div className={styles.leyendaTitle}>Residuos Comunes</div>
                  <div className={styles.leyendaItem}>
                    <span className={styles.binBlack}></span> No reciclable
                  </div>
                  <div className={styles.leyendaItem}>
                    <span className={styles.binBlue}></span> Reciclable
                  </div>
                  <div className={styles.leyendaItem}>
                    <span className={styles.binGreen}></span> Orgánico
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className={styles.card}>
            <h3 className={styles.subtitle}>Rutas del día</h3>
            <div className={styles.rutaList}>
              {calendario.map((c) => (
                <div
                  key={c.id}
                  className={`${styles.rutaItem} flex-wrap d-flex align-items-center gap-2 gap-md-3`}
                >
                  <span
                    className={styles.rutaDot + " " + styles.dotGreen}
                  ></span>
                  <span className="flex-grow-1 min-w-0">
                    <span className={styles.rutaName}>
                      Ruta {c.ruta_id} – {diasSemana[c.dia_semana]} (
                      {c.hora_inicio}–{c.hora_fin})
                    </span>
                  </span>
                  <span
                    className={styles.rutaStatus + " " + styles.statusGreen}
                  >
                    {c.frecuencia}
                  </span>
                  <div
                    className={`d-flex flex-wrap gap-2 ms-auto ${styles.rutaDetails}`}
                    style={{ minWidth: 0 }}
                  >
                    <span className={styles.rutaTag}>
                      <b>Notas:</b> {c.notas}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}