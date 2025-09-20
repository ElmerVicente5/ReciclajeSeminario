import { useEffect, useState } from "react";
import { obtenerRutas, crearRuta, actualizarRuta, eliminarRuta, obtenerZonas } from "../../services/api";
import { Button, Table, Modal, Form } from "react-bootstrap";

export default function RutaPanel() {
  const [rutas, setRutas] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nombre: "", zona_id: "", id: null, activo: true });

  const refreshRutas = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await obtenerRutas();
      console.log("Respuesta rutas:", res);
      // Si la respuesta es { rutas: [...] }, extraer rutas de esa propiedad
      let rutasArray = [];
      if (Array.isArray(res)) {
        // Si es un array de zonas con rutas anidadas
        rutasArray = res.flatMap(zona =>
          Array.isArray(zona.rutas)
            ? zona.rutas.map(r => ({
                ...r,
                zona_id: zona.id,
                zona_nombre: zona.nombre
              }))
            : []
        );
      } else if (Array.isArray(res.rutas)) {
        // Si es un objeto con propiedad rutas
        rutasArray = res.rutas.flatMap(zona =>
          Array.isArray(zona.rutas)
            ? zona.rutas.map(r => ({
                ...r,
                zona_id: zona.id,
                zona_nombre: zona.nombre
              }))
            : []
        );
      }
      setRutas(rutasArray);
      setLoading(false);
    } catch (err) {
      setError("Error al obtener rutas");
      setLoading(false);
    }
  };

  const refreshZonas = async () => {
    try {
      // Usa el mismo API que PanelZonas para obtener zonas
      const res = await obtenerZonas();
      // Si res.zonas existe, úsalo; si no, usa res directamente
      const zonasArray = Array.isArray(res) ? res : (Array.isArray(res.zonas) ? res.zonas : []);
      setZonas(zonasArray);
    } catch (err) {
      // Opcional: manejar error de zonas
    }
  };

  useEffect(() => {
    refreshRutas();
    refreshZonas();
  }, []);

  const handleAdd = () => {
    setForm({ nombre: "", zona_id: "", id: null, activo: true });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (ruta) => {
    setForm({
      nombre: ruta.nombre,
      zona_id: ruta.zona_id,
      id: ruta.id,
      activo: ruta.activo ?? true
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await eliminarRuta(id);
    refreshRutas();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.zona_id) return;
    if (editMode && form.id) {
      await actualizarRuta({
        id: form.id,
        nombre: form.nombre,
        zona_id: Number(form.zona_id),
        activo: form.activo
      });
    } else {
      await crearRuta({
        nombre: form.nombre,
        zona_id: Number(form.zona_id)
      });
    }
    setShowModal(false);
    refreshRutas();
  };

  return (
    <div>
      <div className="mb-2 d-flex gap-2">
        <Button variant="success" size="sm" onClick={handleAdd}>
          Agregar ruta
        </Button>
      </div>
      {loading && <div className="alert alert-info">Cargando rutas...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <Table striped bordered hover size="sm" className="mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Zona ID</th>
            <th>Zona</th>
            <th>Activo</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rutas.map((r) => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.zona_id}</td>
              <td>{r.zona_nombre || ""}</td>
              <td>{r.activo ? "Sí" : "No"}</td>
              <td>{r.nombre}</td>
              <td>
                <Button size="sm" variant="outline-warning" className="me-1" onClick={() => handleEdit(r)}>
                  Editar
                </Button>
                <Button size="sm" variant="outline-danger" onClick={() => handleDelete(r.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Editar ruta" : "Agregar ruta"}</Modal.Title>
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
              <Form.Label>Zona</Form.Label>
              <Form.Select
                name="zona_id"
                value={form.zona_id}
                onChange={e => setForm(f => ({ ...f, zona_id: e.target.value }))}
                required
              >
                <option value="">Seleccione una zona...</option>
                {zonas.map(z => (
                  <option key={z.id} value={z.id}>
                    {z.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {editMode && (
              <Form.Group className="mb-2">
                <Form.Label>Activo</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="Activo"
                  checked={form.activo}
                  onChange={e => setForm(f => ({ ...f, activo: e.target.checked }))}
                />
              </Form.Group>
            )}
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
