import { useState, useEffect } from "react";
import Roles from "./Roles";
import useUsuarios from "../../hooks/useUsuarios";
import styles from "./Usuarios.module.css";
import { Table, Button, Modal, Form } from "react-bootstrap";

export default function Usuarios() {
  const {
    usuarios,
    cargarUsuarios,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
    error,
    loading,
    // Si tienes hooks para roles y zonas, agrégalos aquí
  } = useUsuarios();

  // Si tienes hooks para roles y zonas, reemplaza estos estados por los hooks
  const [roles, setRoles] = useState([]);
  const [zonas, setZonas] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    contraseña: "",
    rol_id: "",
    zona_id: "",
  });
  const [editMode, setEditMode] = useState(false);

  // Cargar usuarios, roles y zonas al montar
  useEffect(() => {
    cargarUsuarios();
    // Si tienes hooks para roles y zonas, llama aquí a cargarRoles() y cargarZonas()
    // setRoles(await cargarRoles());
    // setZonas(await cargarZonas());
  }, []);

  const handleEdit = (usuario) => {
    setShowModal(true);
    setEditMode(true);
    setForm({
      id: usuario.id,
      nombre: usuario.nombre,
      contraseña: "", // No mostrar la contraseña actual
      rol_id: usuario.rol_id,
      zona_id: usuario.zona_id,
    });
  };

  const handleCreate = () => {
    setShowModal(true);
    setEditMode(false);
    setForm({
      id: null,
      nombre: "",
      contraseña: "",
      rol_id: "",
      zona_id: "",
    });
  };

  const handleSave = async () => {
    if (editMode) {
      await editarUsuario(form);
    } else {
      await crearUsuario(form);
    }
    setShowModal(false);
  };

  return (
    <div className={styles.pageBg}>
      <h1>Gestión de Usuarios</h1>
      <Button variant="primary" onClick={handleCreate}>
        Nuevo Usuario
      </Button>
      {error && <div className={styles.error}>{error}</div>}
      <div className="table-responsive mt-3">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Rol</th>
              <th>Zona</th>
              <th>Fecha registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre}</td>
                <td>
                  {roles.find((r) => r.id === u.rol_id)?.nombre || u.rol_id}
                </td>
                <td>
                  {zonas.find((z) => z.id === u.zona_id)?.nombre || u.zona_id}
                </td>
                <td>{u.fecha_registro}</td>
                <td>
                  <Button size="sm" onClick={() => handleEdit(u)}>
                    Editar
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => eliminarUsuario(u.id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editMode ? "Editar Usuario" : "Nuevo Usuario"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={form.contraseña}
                onChange={(e) =>
                  setForm({ ...form, contraseña: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                value={form.rol_id}
                onChange={(e) => setForm({ ...form, rol_id: e.target.value })}
              >
                <option value="">Seleccione...</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Zona</Form.Label>
              <Form.Select
                value={form.zona_id}
                onChange={(e) => setForm({ ...form, zona_id: e.target.value })}
              >
                <option value="">Seleccione...</option>
                {zonas.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editMode ? "Guardar" : "Crear"}
          </Button>
        </Modal.Footer>
      </Modal>
      <hr />
      <Roles />
    </div>
  );
}