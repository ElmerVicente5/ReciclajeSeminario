import { useState, useEffect } from "react";
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
import styles from "./MapLeafletPage.module.css";
import { useAcopio } from "../../hooks/useAcopio";
import { isAuthenticated } from "../../services/api";
import { Button, Modal } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";

export default function MapLeafletPage() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const { getAcopio } = useAcopio();
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false); // Estado para el modal del mapa

  // Estado para filtro de zona
  const [zonaFiltro, setZonaFiltro] = useState(0); // 0 = todas

  // Obtén los puntos desde la API
  useEffect(() => {
    const fetchPuntos = async () => {
      setLoading(true);
      try {
        const data = await getAcopio();
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

  const handleAgregar = () => {
    // Aquí puedes abrir un modal o navegar a la página de agregar punto
    alert("Agregar nuevo punto de acopio");
  };

  return (
    <div className={`${styles.pageBg} container-fluid`}>
      <div className={`${styles.usuariosContainer} row mx-auto`}>
        <div className="col-12">
          <div className={`d-flex align-items-center ${styles.usuariosHeader}`}>
            <h1 className={styles.panelTitle}>Puntos de Acopio</h1>
          </div>
          {/* Filtros y botón agregar */}
          <div className="row mb-3">
            <div className="col-12 col-md-4 mb-2 mb-md-0 d-flex align-items-center">
              <select
                className={`form-select ${styles.filtroSelect}`}
                value={zonaFiltro}
                onChange={(e) => setZonaFiltro(Number(e.target.value))}
              >
                <option value={0}>Todas las zonas</option>
                {zonasUnicas.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nombre}
                  </option>
                ))}
              </select>
              <Button
                variant="success"
                className="ms-2"
                style={{
                  borderRadius: 8,
                  fontWeight: 500,
                  padding: "8px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                onClick={handleAgregar}
              >
                <FaPlus />
                Agregar
              </Button>
            </div>
            {/* Elimina el botón de ver mapa interactivo */}
          </div>
          <div className="row">
            <div className="col-12 col-lg-7 d-flex flex-column" style={{ minHeight: 350 }}>
              <div className={styles.cardScrollContainer}>
                <table className={`table table-striped table-bordered ${styles.acopioTable}`}>
                  <thead className={styles.acopioTableHeader}>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Tipo</th>
                      <th>Horario</th>
                      <th>Dirección</th>
                      <th>Zona</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-4">
                          <span className="spinner-border text-primary" />
                        </td>
                      </tr>
                    ) : puntosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No hay puntos disponibles.
                        </td>
                      </tr>
                    ) : (
                      puntosFiltrados.map((p) => {
                        const zonaNombre = p.zonas?.nombre || `Zona ${p.zona_id}`;
                        const zonaCodigo = p.zonas?.codigo;
                        return (
                          <tr key={p.id} className={styles.acopioTableRow}>
                            <td>{p.id}</td>
                            <td>
                              <div className={styles.puntoNombre}>{p.nombre}</div>
                            </td>
                            <td>{p.tipo}</td>
                            <td>{p.horario}</td>
                            <td>{p.direccion}</td>
                            <td>
                              {zonaNombre}
                              {zonaCodigo && (
                                <span> | <b>Código:</b> {zonaCodigo}</span>
                              )}
                            </td>
                            <td>
                              <span className={p.estadoClass}>{p.estado}</span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Mapa al lado derecho */}
            <div className="col-12 col-lg-5 d-flex flex-column" style={{ minHeight: 350 }}>
              <div className={styles.mapaContainer}>
                <MapLeaflet puntos={puntosFiltrados} />
              </div>
            </div>
          </div>
          {/* Modal para el mapa interactivo */}
          <Modal
            show={showMap}
            onHide={() => setShowMap(false)}
            size="xl"
            centered
            dialogClassName={styles.mapaModal}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Mapa Interactivo de Puntos de Acopio
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: 0 }}>
              <div className={styles.mapaContainer}>
                <MapLeaflet puntos={puntosFiltrados} />
              </div>
              <div className="text-center py-3">
                <Button variant="secondary" onClick={() => setShowMap(false)}>
                  Cerrar mapa
                </Button>
                <span className="ms-3 text-muted" style={{ fontSize: "1rem" }}>
                  Puedes cerrar el mapa con el botón o la X arriba.
                </span>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}