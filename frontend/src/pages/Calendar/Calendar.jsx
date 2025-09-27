import { useEffect, useState } from "react";
import CalendarioTable from "./CalendarioTable";
import CalendarioForm from "./CalendarioForm";
import CalendarioFilters from "./CalendarioFilters";
import CalendarioMap from "./CalendarioMap";
import { useCalendario } from "../../hooks/useCalendario";
import { isAuthenticated } from "../../services/api";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

export default function Calendar() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const calendarioHook = useCalendario();
  const [showForm, setShowForm] = useState(false);
  const [editingHorario, setEditingHorario] = useState(null);

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
      
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          {!isLoading && !hasError && calendario.length === 0 && (
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              No hay horarios registrados. Haga clic en "Agregar horario" para crear el primero.
            </div>
          )}
          <CalendarioTable 
            calendarioHook={calendarioHook} 
            onEdit={handleEdit}
          />
        </div>
        <div className="col-12 col-lg-5">
          <CalendarioMap calendarioHook={calendarioHook} />
        </div>
      </div>
      
      <CalendarioForm
        show={showForm}
        onHide={handleCloseForm}
        calendarioHook={calendarioHook}
        editingHorario={editingHorario}
      />
    </div>
  );
}
