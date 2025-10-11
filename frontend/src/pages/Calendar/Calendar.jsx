import { useEffect, useState } from "react";
import CalendarioTable from "./CalendarioTable";
import CalendarioForm from "./CalendarioForm";
import CalendarioFilters from "./CalendarioFilters";
import CalendarioMap from "./CalendarioMap";
import { useCalendario } from "../../hooks/useCalendario";
import { isAuthenticated } from "../../services/api";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import { Modal, Button } from "react-bootstrap";

export default function Calendar() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const calendarioHook = useCalendario();
  const [showForm, setShowForm] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horarioToDelete, setHorarioToDelete] = useState(null);

  // Carga los datos al montar el componente y cada vez que se agrega/edita/elimina
  useEffect(() => {
    calendarioHook.refreshCalendario && calendarioHook.refreshCalendario();
  }, []);

  // Muestra mensaje si no hay datos
  const isLoading = calendarioHook.loading;
  const hasError = calendarioHook.error;
  const calendario = Array.isArray(calendarioHook.calendario) ? calendarioHook.calendario : [];

  const handleEdit = (horario) => {
    setEditingHorario(horario);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingHorario(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingHorario(null);
  };

  // Visual modal para confirmar eliminación
  const handleDelete = (horario) => {
    setHorarioToDelete(horario);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (horarioToDelete) {
      await calendarioHook.handleDelete(horarioToDelete.id);
      setShowDeleteModal(false);
      setHorarioToDelete(null);
      // Puedes agregar aquí una notificación visual si tienes un toast global
      // Ejemplo: toast("Horario eliminado correctamente", { type: "success" });
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setHorarioToDelete(null);
  };

  // Estilos verdes para el modal de confirmación
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
    <div className="container-fluid px-2 px-md-4 py-3" style={{ position: "relative" }}>
      <LoadingOverlay loading={isLoading} error={hasError} />
      
      <div className="mb-3 d-flex gap-2 flex-wrap align-items-center justify-content-between">
        <h2 className="mb-0">Gestión de Horarios</h2>
        <button className="btn btn-success" onClick={handleAdd}>
          <i className="fas fa-plus me-2"></i>
          Agregar horario
        </button>
      </div>
      
      <CalendarioFilters calendarioHook={calendarioHook} />
      
      {/* Mapa arriba, tabla abajo, ambos col-12 */}
      <div className="row g-4">
        <div className="col-12">
          <CalendarioMap calendarioHook={calendarioHook} />
        </div>
        <div className="col-12">
          {!isLoading && !hasError && calendario.length === 0 && (
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              No hay horarios registrados. Haga clic en "Agregar horario" para crear el primero.
            </div>
          )}
          <CalendarioTable 
            calendarioHook={{
              ...calendarioHook,
              handleDelete: handleDelete
            }} 
            onEdit={handleEdit}
          />
        </div>
      </div>
      
      <CalendarioForm
        show={showForm}
        onHide={handleCloseForm}
        calendarioHook={calendarioHook}
        editingHorario={editingHorario}
      />
      
      {/* Modal de confirmación visual para eliminar */}
      <Modal show={showDeleteModal} onHide={cancelDelete} centered>
        <div style={holoModalStyle}>
          <Modal.Header closeButton style={{ border: "none", background: "transparent" }}>
            <Modal.Title style={{ color: "#168126", fontWeight: 700 }}>Confirmar eliminación</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ textAlign: "center", fontSize: "1.08rem", color: "#168126", background: "transparent" }}>
            ¿Está seguro de eliminar este horario?
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
// ¡Listo! El diseño holográfico verde ya está aplicado en el modal de confirmación.
