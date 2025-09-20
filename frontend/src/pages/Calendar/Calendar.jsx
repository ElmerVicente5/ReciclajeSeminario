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

  // Carga los datos al montar el componente y cada vez que se agrega/edita/elimina
  useEffect(() => {
    calendarioHook.refreshCalendario && calendarioHook.refreshCalendario();
  }, []);

  // Muestra mensaje si no hay datos
  const isLoading = calendarioHook.loading;
  const hasError = calendarioHook.error;
  const calendario = Array.isArray(calendarioHook.calendario) ? calendarioHook.calendario : [];

  return (
    <div className="container-fluid px-2 px-md-4 py-3" style={{ position: "relative" }}>
      <LoadingOverlay loading={isLoading} error={hasError} />
      <div className="mb-3 d-flex gap-2 flex-wrap">
        <button className="btn btn-success btn-sm" onClick={() => setShowForm(true)}>
          Agregar horario
        </button>
      </div>
      <CalendarioFilters calendarioHook={calendarioHook} />
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          {!isLoading && !hasError && calendario.length === 0 && (
            <div className="alert alert-warning">No hay horarios para mostrar.</div>
          )}
          <CalendarioTable calendarioHook={calendarioHook} onEdit={() => setShowForm(true)} />
        </div>
        <div className="col-12 col-lg-5">
          <CalendarioMap calendarioHook={calendarioHook} />
        </div>
      </div>
      <CalendarioForm
        show={showForm}
        onHide={() => setShowForm(false)}
        calendarioHook={calendarioHook}
      />
    </div>
  );
}
       