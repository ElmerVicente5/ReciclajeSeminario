import { useState, useEffect } from "react";
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
import styles from "./MapLeafletPage.module.css";
import { useAcopio } from "../../hooks/useAcopio"; // Importa el hook

export default function MapLeafletPage() {
  const { getAcopio } = useAcopio();
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulación de zonas
  const zonas = [
    { id: 1, nombre: "Zona Centro" },
    { id: 2, nombre: "Zona Norte" },
    { id: 3, nombre: "Zona Sur" },
  ];

  // Resumen (puedes calcularlo dinámicamente si lo necesitas)
  const resumen = [
    { label: "Activos", value: puntos.filter(p => p.estado === "Activo").length, className: styles.resumenActivo },
    { label: "Saturados", value: puntos.filter(p => p.estado === "Saturado").length, className: styles.resumenSaturado },
    { label: "Fuera de servicio", value: puntos.filter(p => p.estado === "Fuera de servicio").length, className: styles.resumenFuera },
  ];

  // Estado para filtro de zona
  const [zonaFiltro, setZonaFiltro] = useState(0); // 0 = todas
  const puntosFiltrados =
    zonaFiltro === 0 ? puntos : puntos.filter((p) => p.zona_id === zonaFiltro);

  useEffect(() => {
    const fetchPuntos = async () => {
      setLoading(true);
      try {
        const data = await getAcopio();
        // Si tu API devuelve los puntos en data.puntos, ajusta aquí
        setPuntos(
          data.map((p) => ({
            ...p,
            estadoClass:
              p.estado === "Activo"
                ? styles.activo
                : p.estado === "Saturado"
                ? styles.saturado
                : styles.fuera,
          }))
        );
      } catch (error) {
        setPuntos([]);
      }
      setLoading(false);
    };
    fetchPuntos();
  }, [getAcopio]);

  return (
    <div className={styles.pageBg}>
      <div className={`container-fluid px-2 px-md-4 py-3 ${styles.container}`}>
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <h1 className={styles.titulo}>Puntos de Acopio</h1>
            <div className="d-flex flex-row flex-wrap gap-3 mb-3 align-items-stretch">
              <div
                className={`d-flex flex-row flex-wrap gap-2 ${styles.filtros}`}
                style={{ flex: 2, minWidth: 0 }}
              >
                <div className={styles.filtro}>
                  Zona
                  <br />
                  <select
                    className="form-select form-select-sm mt-1"
                    value={zonaFiltro}
                    onChange={(e) => setZonaFiltro(Number(e.target.value))}
                  >
                    <option value={0}>Todas</option>
                    {zonas.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.filtro}>
                  Residuo
                  <br />
                  Todos
                </div>
                <div className={styles.filtro}>
                  Estado
                  <br />
                  Todos
                </div>
                <div className={styles.filtro}>
                  Buscar
                  <br />
                  Dirección
                </div>
              </div>
              <div
                className={`d-flex flex-row gap-2 ${styles.resumen}`}
                style={{ flex: 1, minWidth: 0 }}
              >
                {resumen.map((r) => (
                  <div key={r.label} className={styles.resumenItem}>
                    {r.label}
                    <span className={r.className}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${styles.listados} w-100`}>
              <div className={styles.listadoTitulo}>Listados de Puntos</div>
              <div className="d-flex flex-column gap-3">
                {loading ? (
                  <div>Cargando puntos...</div>
                ) : puntosFiltrados.length === 0 ? (
                  <div>No hay puntos disponibles.</div>
                ) : (
                  puntosFiltrados.map((p) => {
                    const zona =
                      zonas.find((z) => z.id === p.zona_id)?.nombre || p.zona_id;
                    return (
                      <div
                        key={p.id}
                        className={`${styles.punto} d-flex flex-wrap align-items-center gap-2 gap-md-3 w-100`}
                      >
                        <span className="fw-bold flex-grow-1 min-w-0">
                          {p.nombre}
                        </span>
                        <span className={p.estadoClass} style={{ marginLeft: 8 }}>
                          {p.estado}
                        </span>
                        <div
                          style={{
                            color: "#222e3a",
                            fontSize: "0.98rem",
                            marginBottom: 4,
                          }}
                        >
                          <b>Tipo:</b> {p.tipo} | <b>Zona:</b> {zona} |{" "}
                          <b>Horario:</b> {p.horario}
                        </div>
                        <div
                          style={{
                            color: "#222e3a",
                            fontSize: "0.98rem",
                            marginBottom: 4,
                          }}
                        >
                          <b>Dirección:</b> {p.direccion}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <MapLeaflet puntos={puntosFiltrados} />
          </div>
        </div>
      </div>
    </div>
  );
}