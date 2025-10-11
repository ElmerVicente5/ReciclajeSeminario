import { useState, useEffect } from "react";
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
import styles from "./MapLeafletPage.module.css";
import { useAcopio } from "../../hooks/useAcopio";
import { isAuthenticated } from "../../services/api";
import { Button, Modal, Spinner } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa"; // Usa iconos de react-icons
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import AcopioForm from "./AcopioForm";

export default function MapLeafletPage() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const { getAcopio } = useAcopio();
  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMap, setShowMap] = useState(false); // Estado para el modal del mapa
  const [showForm, setShowForm] = useState(false);
  const [editingAcopio, setEditingAcopio] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [acopioToDelete, setAcopioToDelete] = useState(null);

  // Estado para filtro de zona
  const [zonaFiltro, setZonaFiltro] = useState(0); // 0 = todas

  // Obtén los puntos desde la API
  useEffect(() => {
    const fetchPuntos = async () => {
      setLoading(true);
      setError("");
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
        setError("Error al cargar puntos de acopio.");
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
    setEditingAcopio(null);
    setShowForm(true);
  };

  const handleEdit = (acopio) => {
    console.log('Editando acopio:', acopio);
    setEditingAcopio(acopio);
    setShowForm(true);
  };

  // Visual modal para confirmar eliminación
  const handleDelete = (acopio) => {
    setAcopioToDelete(acopio);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (acopioToDelete) {
      // TODO: Implementar cuando el backend tenga DELETE
      // await deleteAcopio(acopioToDelete.id);
      setShowDeleteModal(false);
      // Puedes agregar aquí una notificación simple si tienes otra función de toast global
      // Ejemplo: toast("Centro de acopio eliminado correctamente", { type: "success" });
      setAcopioToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAcopioToDelete(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setTimeout(() => {
      setEditingAcopio(null);
    }, 300);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    // Refrescar datos
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
        setError("Error al cargar puntos de acopio.");
      } finally {
        setLoading(false);
      }
    };
    fetchPuntos();
  };

  // Estilos verdes holográficos para el modal de confirmación
  const holoBtnStyle = {
    background: "linear-gradient(90deg, #43ea7c 0%, #168126 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "18px",
    boxShadow: "0 0 12px 2px #43ea7c88, 0 0 24px 2px #16812644",
    fontWeight: 600,
    padding: "8px 22px",
    margin: "0 6px 6px 0",
    letterSpacing: "0.5px",
    transition: "transform 0.15s, box-shadow 0.15s"
  };

  const holoModalStyle = {
    background: "linear-gradient(120deg, #e0ffe0 0%, #43ea7c 100%)",
    borderRadius: "22px",
    boxShadow: "0 0 24px 2px #43ea7c44, 0 0 32px 4px #16812622"
  };

  return (
    <div className={`${styles.pageBg} container-fluid`} style={{ position: "relative" }}>
      <LoadingOverlay loading={loading} error={error} />
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
          </div>
          <div className="row">
            {/* Tabla arriba */}
            <div className="col-12">
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
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!loading && !error && puntosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center">
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
                            <td>
                              <div className="btn-group btn-group-sm" role="group">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => handleEdit(p)}
                                  title="Editar centro"
                                  className="d-flex align-items-center"
                                >
                                  <FaEdit size={16} />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(p)}
                                  title="Eliminar centro"
                                  className="d-flex align-items-center"
                                >
                                  <FaTrashAlt size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Mapa abajo */}
            <div className="col-12">
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
      <AcopioForm
        show={showForm}
        onHide={handleCloseForm}
        editingAcopio={editingAcopio}
        onSuccess={handleFormSuccess}
      />
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <div style={holoModalStyle}>
          <Modal.Header closeButton style={{ border: "none", background: "transparent" }}>
            <Modal.Title style={{ color: "#168126", fontWeight: 700 }}>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center", fontSize: "1.08rem", color: "#168126", background: "transparent" }}>
            ¿Está seguro de eliminar el centro de acopio <b>{acopioToDelete?.nombre}</b>?
          </Modal.Body>
          <Modal.Footer style={{ border: "none", background: "transparent", justifyContent: "center" }}>
            <Button style={holoBtnStyle} onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button style={holoBtnStyle} onClick={confirmDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}