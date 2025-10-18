import { useState, useEffect } from "react";
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
import styles from "./MapLeafletPage.module.css";
import { isAuthenticated } from "../../services/api";
import { Button, Modal } from "react-bootstrap";
import { FaPlus, FaEdit, FaTrashAlt } from "react-icons/fa";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import AcopioForm from "./AcopioForm";
import useAcopio from "../../hooks/useAcopio";

export default function MapLeafletPage() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const { getAcopio, eliminarAcopio, loading, error } = useAcopio();
  const [puntos, setPuntos] = useState([]);
  const [showMap, setShowMap] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAcopio, setEditingAcopio] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [acopioToDelete, setAcopioToDelete] = useState(null);
  const [zonaFiltro, setZonaFiltro] = useState(0);

  // Cargar puntos al montar
  useEffect(() => {
    const fetchPuntos = async () => {
      try {
        const data = await getAcopio();
        setPuntos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPuntos();
  }, [getAcopio]);

  // Filtrar puntos por zona
  const puntosFiltrados =
    zonaFiltro === 0
      ? puntos
      : puntos.filter((p) =>
          p.zonas?.id ? p.zonas.id === zonaFiltro : p.zona_id === zonaFiltro
        );

  // Opciones de zonas para el filtro
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
    setEditingAcopio(acopio);
    setShowForm(true);
  };

  const handleDelete = (acopio) => {
    setAcopioToDelete(acopio);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (acopioToDelete) {
      try {
        await eliminarAcopio(acopioToDelete.id);
        setPuntos((prev) => prev.filter((p) => p.id !== acopioToDelete.id));
        setShowDeleteModal(false);
        setAcopioToDelete(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setAcopioToDelete(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAcopio(null);
  };

  const handleFormSuccess = async () => {
    handleCloseForm();
    try {
      const data = await getAcopio();
      setPuntos(data);
    } catch (err) {
      console.error(err);
    }
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
    transition: "transform 0.15s, box-shadow 0.15s",
  };

  const holoModalStyle = {
    background: "linear-gradient(120deg, #e0ffe0 0%, #43ea7c 100%)",
    borderRadius: "22px",
    boxShadow: "0 0 24px 2px #43ea7c44, 0 0 32px 4px #16812622",
  };

  const tableStyles = {
    fontSize: "12px", // Ajustar el tamaño de fuente a 12px
    textAlign: "left",
  };

  const columnWidths = {
    id: "30px",
    nombre: "200px",
    tipo: "120px",
    horario: "180px",
    direccion: "250px",
    zona: "150px",
    estado: "50px",
    acciones: "150px",
  };

  const numberStyles = {
    fontWeight: "normal", // Quitar el estilo bold para los números
    textAlign: "center",
    fontSize: "12px", // Ajustar el tamaño de fuente a 12px
  };

  const nameStyles = {
    fontWeight: "normal", // Quitar el estilo bold para los nombres
    textAlign: "center",
    fontSize: "12px", // Ajustar el tamaño de fuente a 12px
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
                style={tableStyles}
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
                  ...tableStyles,
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
                <table className={`table table-striped table-bordered ${styles.acopioTable}`} style={tableStyles}>
                  <thead className={styles.acopioTableHeader}>
                    <tr>
                      <th style={{ width: columnWidths.id }}>ID</th>
                      <th style={{ width: columnWidths.nombre }}>Nombre</th>
                      <th style={{ width: columnWidths.tipo }}>Tipo</th>
                      <th style={{ width: columnWidths.horario }}>Horario</th>
                      <th style={{ width: columnWidths.direccion }}>Dirección</th>
                      <th style={{ width: columnWidths.zona }}>Zona</th>
                      <th style={{ width: columnWidths.estado }}>Estado</th>
                      <th style={{ width: columnWidths.acciones }}>Acciones</th>
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
                      puntosFiltrados.map((p) => (
                        <tr key={p.id} className={styles.acopioTableRow} style={tableStyles}>
                          <td style={numberStyles}>{p.id}</td>
                          <td style={nameStyles}>
                            <div className={styles.puntoNombre}>{p.nombre || "N/A"}</div>
                          </td>
                          <td>{p.tipo || "N/A"}</td>
                          <td>{p.horario || "N/A"}</td>
                          <td>{p.direccion || "N/A"}</td>
                          <td>{p.zonas?.nombre || `Zona ${p.zona_id || "N/A"}`}</td>
                          <td>
                            <span className={p.estadoClass}>{p.estado || "N/A"}</span>
                          </td>
                          <td>
                            <div className="btn-group btn-group-sm" role="group">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => handleEdit(p)}
                                title="Editar centro"
                                className="d-flex align-items-center"
                                style={tableStyles}
                              >
                                <FaEdit size={16} />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDelete(p)}
                                title="Eliminar centro"
                                className="d-flex align-items-center"
                                style={tableStyles}
                              >
                                <FaTrashAlt size={16} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
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
              <Modal.Title style={tableStyles}>
                Mapa Interactivo de Puntos de Acopio
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: 0, fontSize: "12px" }}>
              <div className={styles.mapaContainer}>
                <MapLeaflet puntos={puntosFiltrados} />
              </div>
              <div className="text-center py-3">
                <Button variant="secondary" onClick={() => setShowMap(false)} style={{ fontSize: "12px" }}>
                  Cerrar mapa
                </Button>
                <span className="ms-3 text-muted" style={{ fontSize: "12px" }}>
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
            <Modal.Title style={{ color: "#168126", fontWeight: 700, ...tableStyles }}>
              Confirmar eliminación
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center", fontSize: "1.08rem", color: "#168126", background: "transparent", ...tableStyles }}>
            ¿Está seguro de eliminar el centro de acopio <b>{acopioToDelete?.nombre}</b>?
          </Modal.Body>
          <Modal.Footer style={{ border: "none", background: "transparent", justifyContent: "center" }}>
            <Button style={{ ...holoBtnStyle, ...tableStyles }} onClick={cancelDelete}>
              Cancelar
            </Button>
            <Button style={{ ...holoBtnStyle, ...tableStyles }} onClick={confirmDelete}>
              Eliminar
            </Button>
          </Modal.Footer>
        </div>
      </Modal>
    </div>
  );
}