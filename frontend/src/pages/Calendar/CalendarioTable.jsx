import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

// Recibe calendarioHook y onEdit
export default function CalendarioTable({ calendarioHook, onEdit }) {
  const { calendario = [], diasSemana = [], handleEdit, handleDelete } = calendarioHook;

  const tableStyles = {
    fontSize: "12px", // Ajustar el tamaño de fuente a 12px
  };

  const rutaStyles = {
    fontWeight: "normal", // Quitar el estilo bold para los campos de Ruta
  };

  if (!Array.isArray(calendario) || calendario.length === 0) {
    return (
      <div className="table-responsive mt-3" style={{ maxHeight: 350, overflowY: "auto", ...tableStyles }}>
        <div className="alert alert-info" style={tableStyles}>No hay horarios para mostrar.</div>
      </div>
    );
  }

  return (
    <div className="table-responsive mt-3" style={{ maxHeight: 350, overflowY: "auto", ...tableStyles }}>
      <Table striped bordered hover size="sm" className="mb-0" style={tableStyles}>
        <thead>
          <tr>
            <th>Ruta</th>
            <th>Día</th>
            <th>Hora inicio</th>
            <th>Hora fin</th>
            <th>Frecuencia</th>
            <th>Notas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {calendario.map((c) => (
            <tr key={c.id} style={tableStyles}>
              <td style={rutaStyles}>{c.ruta_id}</td>
              <td>{diasSemana[c.dia_semana]}</td>
              <td>{c.hora_inicio?.slice(11, 16)}</td>
              <td>{c.hora_fin?.slice(11, 16)}</td>
              <td>{c.frecuencia}</td>
              <td>{c.notas}</td>
              <td>
                <div className="d-flex flex-row gap-2 justify-content-center">
                  <Button size="sm" variant="outline-warning" className="d-flex align-items-center" style={tableStyles} onClick={() => { handleEdit(c); onEdit(); }}>
                    <FaEdit size={15} />
                  </Button>
                  <Button size="sm" variant="outline-danger" className="d-flex align-items-center" style={tableStyles} onClick={() => handleDelete(c.id)}>
                    <FaTrashAlt size={15} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
