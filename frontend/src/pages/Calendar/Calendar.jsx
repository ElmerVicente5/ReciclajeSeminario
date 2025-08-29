import styles from "./Calendar.module.css";
import { Table } from "react-bootstrap";
import { FaUser, FaTruck } from "react-icons/fa";
import CalendarWidget from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";

export default function Calendar() {
  const [date, setDate] = useState(new Date());
  return (
    <div className={`container-fluid px-2 px-md-4 py-3`}>
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
              {/* Card Ruta 1 */}
              <div
                className={`${styles.rutaItem} flex-wrap d-flex align-items-center gap-2 gap-md-3`}
              >
                <span className={styles.rutaDot + " " + styles.dotGreen}></span>
                <span className="flex-grow-1 min-w-0">
                  <span className={styles.rutaName}>
                    Ruta 1 – Zona Norte (08:00–11:00)
                  </span>
                </span>
                <span className={styles.rutaStatus + " " + styles.statusGreen}>
                  Completada
                </span>
                <div
                  className={`d-flex flex-wrap gap-2 ms-auto ${styles.rutaDetails}`}
                  style={{ minWidth: 0 }}
                >
                  <span className={styles.rutaTag}>
                    <FaUser /> Piloto: E.Perez
                  </span>
                  <span className={styles.rutaTag}>
                    <FaTruck /> Camión: C-25782
                  </span>
                </div>
              </div>
              {/* Card Ruta 2 */}
              <div
                className={`${styles.rutaItem} flex-wrap d-flex align-items-center gap-2 gap-md-3`}
              >
                <span
                  className={styles.rutaDot + " " + styles.dotYellow}
                ></span>
                <span className="flex-grow-1 min-w-0">
                  <span className={styles.rutaName}>Ruta 2: Zona Sur</span>
                </span>
                <span className={styles.rutaStatus + " " + styles.statusYellow}>
                  En curso
                </span>
                <div
                  className={`d-flex flex-wrap gap-2 ms-auto ${styles.rutaDetails}`}
                  style={{ minWidth: 0 }}
                >
                  <span className={styles.rutaTag}>
                    <FaUser /> Piloto: E.Perez
                  </span>
                  <span className={styles.rutaTag}>
                    <FaTruck /> Camión: C-25782
                  </span>
                </div>
              </div>
              {/* Card Ruta 3 */}
              <div
                className={`${styles.rutaItem} flex-wrap d-flex align-items-center gap-2 gap-md-3`}
              >
                <span className={styles.rutaDot + " " + styles.dotRed}></span>
                <span className="flex-grow-1 min-w-0">
                  <span className={styles.rutaName}>Ruta 3: Centro</span>
                </span>
                <span className={styles.rutaStatus + " " + styles.statusRed}>
                  Incidencia
                </span>
                <div
                  className={`d-flex flex-wrap gap-2 ms-auto ${styles.rutaDetails}`}
                  style={{ minWidth: 0 }}
                >
                  <span className={styles.rutaTag}>
                    <FaUser /> Piloto: E.Perez
                  </span>
                  <span className={styles.rutaTag}>
                    <FaTruck /> Camión: C-25782
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
