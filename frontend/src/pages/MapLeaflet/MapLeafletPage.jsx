import { useState, useEffect } from "react";
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
import styles from "./MapLeafletPage.module.css";
import { useAcopio } from "../../hooks/useAcopio";
import { isAuthenticated } from "../../services/api";

export default function MapLeafletPage() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const { getAcopio } = useAcopio();
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para filtro de zona
  const [zonaFiltro, setZonaFiltro] = useState(0); // 0 = todas

  // Obtén los puntos desde la API
  useEffect(() => {
    const fetchPuntos = async () => {
      setLoading(true);
      try {
        const data = await getAcopio();
        console.log('Datos de acopio API:', data); // Mostrar datos en consola
        setPuntos(
          data.map((p) => ({
            id: p.id,
            latitud: p.latitud,
            longitud: p.longitud,
            zona_id: p.zona_id,
            horario: p.horario,
            tipo: p.tipo,
            nombre: p.nombre,
            direccion: p.direccion,
            estado: p.estado,
            zonas: p.zonas,
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
  }, []); // <-- Solo se ejecuta una vez al montar

  // Filtrado por zona usando el objeto zonas si existe
  const puntosFiltrados =
    zonaFiltro === 0
      ? puntos
      : puntos.filter((p) =>
          p.zonas?.id ? p.zonas.id === zonaFiltro : p.zona_id === zonaFiltro
        );

  // Resumen dinámico
  const resumen = [
    {
      label: "Activos",
      value: puntos.filter((p) => p.estado === "Activo").length,
      className: styles.resumenActivo,
    },
    {
      label: "Saturados",
      value: puntos.filter((p) => p.estado === "Saturado").length,
      className: styles.resumenSaturado,
    },
    {
      label: "Fuera de servicio",
      value: puntos.filter((p) => p.estado === "Fuera de servicio").length,
      className: styles.resumenFuera,
    },
  ];

  // Opciones de zonas para el filtro (siempre desde los datos)
  const zonasUnicas = [
    ...new Map(
      puntos
        .map((p) =>
          p.zonas
            ? { id: p.zonas.id, nombre: p.zonas.nombre }
            : { id: p.zona_id, nombre: `Zona ${p.zona_id}` }
        )
        .map((z) => [z.id, z])
    ).values(),
  ];

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
                    {zonasUnicas.map((z) => (
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
                    const zonaNombre = p.zonas?.nombre || `Zona ${p.zona_id}`;
                    const zonaCodigo = p.zonas?.codigo;
                    return (
                      <div
                        key={p.id}
                        className={`${styles.punto} d-flex flex-wrap align-items-center gap-2 gap-md-3 w-100`}
                      >
                        <span className="fw-bold flex-grow-1 min-w-0">
                          {p.nombre}
                        </span>
                        <div
                          style={{
                            color: "#222e3a",
                            fontSize: "0.98rem",
                            marginBottom: 4,
                          }}
                        >
                          <b>ID:</b> {p.id} | <b>Latitud:</b> {p.latitud} |{" "}
                          <b>Longitud:</b> {p.longitud} | <b>Zona ID:</b> {p.zona_id} |{" "}
                          <b>Tipo:</b> {p.tipo} | <b>Horario:</b> {p.horario} |{" "}
                          <b>Dirección:</b> {p.direccion}
                        </div>
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
                          <b>Zona:</b> {zonaNombre}
                          {zonaCodigo && (
                            <>
                              {" "}| <b>Código:</b> {zonaCodigo}
                            </>
                          )}
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