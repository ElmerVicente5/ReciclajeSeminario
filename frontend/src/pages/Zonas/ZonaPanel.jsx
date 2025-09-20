import { useEffect, useState } from "react";
import { obtenerZonas, crearZona, actualizarZona, eliminarZona } from "../../services/api";
import { Button, Table, Modal, Form } from "react-bootstrap";

export default function ZonaPanel() {
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nombre: "", codigo: "", id: null });

  const refreshZonas = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Solicitando zonas...");
      const res = await obtenerZonas();
      console.log("Respuesta zonas:", res);
      // Ajuste: si res.zonas existe, usar ese array
      const zonasArray = Array.isArray(res) ? res : (Array.isArray(res.zonas) ? res.zonas : []);
      setZonas(zonasArray);
      setLoading(false);
    } catch (err) {
      console.error("Error al obtener zonas:", err);
      if (err?.response?.status === 401 || err?.message?.includes("No autorizado")) {
        setError("No autorizado. Por favor inicia sesión.");
      } else {
        setError("Error al obtener zonas: " + (err?.message || err));
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshZonas();
  }, []);

  const handleAdd = () => {
    setForm({ nombre: "", codigo: "", id: null });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (zona) => {
    setForm({ nombre: zona.nombre, codigo: zona.codigo, id: zona.id });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await eliminarZona(id);
    refreshZonas();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Para actualizar, enviar id, nombre y codigo (PUT)
    if (editMode && form.id) {
      await actualizarZona({ id: form.id, nombre: form.nombre, codigo: form.codigo });
    } else {
      // Para crear, solo enviar nombre y codigo (POST)
      if (!form.nombre || !form.codigo) return;
      await crearZona({ nombre: form.nombre, codigo: form.codigo });
    }
    setShowModal(false);
    refreshZonas();
  };

  return (
    <div>
      <div className="mb-2 d-flex gap-2">
        <Button variant="success" size="sm" onClick={handleAdd}>
          Agregar zona
        </Button>
      </div>
      {loading && <div className="alert alert-info">Cargando zonas...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <Table striped bordered hover size="sm" className="mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Código</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {zonas.map((z) => (
            <tr key={z.id}>
              <td>{z.id}</td>
              <td>{z.nombre}</td>
              <td>{z.codigo}</td>
              <td>
                <Button size="sm" variant="outline-warning" className="me-1" onClick={() => handleEdit(z)}>
                  Editar
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(z.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar zona" : "Agregar zona"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Código</Form.Label>
              <Form.Control
                type="text"
                name="codigo"
                value={form.codigo}
                onChange={e => setForm(f => ({ ...f, codigo: e.target.value }))}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant={editMode ? "warning" : "success"} type="submit">
              {editMode ? "Actualizar" : "Agregar"}
            </Button>
            <Button variant="outline-secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

// Los datos recibidos cumplen con lo esperado:
// [
//   {id: 1, nombre: 'Barrio Monterrey', codigo: '11001'},
//   ...
// ]
// La tabla y el frontend ya muestran estos datos.
// La tabla y el frontend ya muestran estos datos.
// La tabla y el frontend ya muestran estos datos.
