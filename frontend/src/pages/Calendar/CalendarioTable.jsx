import { Table, Button } from "react-bootstrap";

// Recibe calendarioHook y onEdit
export default function CalendarioTable({ calendarioHook, onEdit }) {
  const { calendario = [], diasSemana = [], handleEdit, handleDelete } = calendarioHook;

  if (!Array.isArray(calendario) || calendario.length === 0) {
    return (
      <div className="table-responsive mt-3" style={{ maxHeight: 350, overflowY: "auto" }}>
        <div className="alert alert-info">No hay horarios para mostrar.</div>
      </div>
    );
  }

  return (
    <div className="table-responsive mt-3" style={{ maxHeight: 350, overflowY: "auto" }}>
      <Table striped bordered hover size="sm" className="mb-0">
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
            <tr key={c.id}>
              <td>{c.ruta_id}</td>
              <td>{diasSemana[c.dia_semana]}</td>
              <td>{c.hora_inicio?.slice(11, 16)}</td>
              <td>{c.hora_fin?.slice(11, 16)}</td>
              <td>{c.frecuencia}</td>
              <td>{c.notas}</td>
              <td>
                <Button size="sm" variant="outline-warning" className="me-1" onClick={() => { handleEdit(c); onEdit(); }}>
                  Editar
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(c.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
