import { Modal, Form, Button } from "react-bootstrap";

// Recibe show, onHide, calendarioHook
export default function CalendarioForm({ show, onHide, calendarioHook }) {
  const { form, setForm, handleFormChange, handleSubmit, editMode, diasSemana } = calendarioHook;

  // Permite cambiar el día desde el formulario
  const handleDiaChange = (e) => {
    setForm(f => ({ ...f, dia_semana: e.target.value }));
  };

  // Permite cambiar la hora usando el input tipo time
  const handleHoraChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? "Editar horario" : "Agregar horario"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* ...campos del formulario... */}
          <Form.Group className="mb-2">
            <Form.Label>Ruta ID</Form.Label>
            <Form.Control
              type="number"
              name="ruta_id"
              value={form.ruta_id}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Día de la semana</Form.Label>
            <Form.Select
              name="dia_semana"
              value={form.dia_semana}
              onChange={handleDiaChange}
              required
            >
              <option value="">Seleccione día</option>
              {diasSemana.map((d, i) => (
                <option key={i} value={i}>{d}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Hora inicio</Form.Label>
            <Form.Control
              type="time"
              name="hora_inicio"
              value={form.hora_inicio || ""}
              onChange={handleHoraChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Hora fin</Form.Label>
            <Form.Control
              type="time"
              name="hora_fin"
              value={form.hora_fin || ""}
              onChange={handleHoraChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Frecuencia</Form.Label>
            <Form.Control
              type="text"
              name="frecuencia"
              value={form.frecuencia}
              onChange={handleFormChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label>Notas</Form.Label>
            <Form.Control
              type="text"
              name="notas"
              value={form.notas}
              onChange={handleFormChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={editMode ? "warning" : "success"} type="submit">
            {editMode ? "Actualizar" : "Agregar"}
          </Button>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
