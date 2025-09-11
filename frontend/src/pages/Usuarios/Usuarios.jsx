import { useState, useEffect } from "react";
import Roles from "./Roles";
import useUsuarios from "../../hooks/useUsuarios";
import useRoles from "../../hooks/useRoles";
import styles from "./Usuarios.module.css";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { isAuthenticated } from "../../services/api";

export default function Usuarios() {
  if (!isAuthenticated()) {
    console.warn("No autenticado, redirigiendo a login. Token:", localStorage.getItem("token"));
    window.location.href = "/login";
    return null;
  }

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

  const { roles, cargarRoles } = useRoles(); // Usar hook de roles
  // Si tienes hooks para zonas, agrégalos igual aquí
  const [zonas, setZonas] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre_completo: "",
    nombre_usuario: "",
    contraseña: "",
    rol_id: "",
    zona_id: "",
    estado: "activo",
  });
  const [editMode, setEditMode] = useState(false);

  // Cargar usuarios, roles y zonas al montar
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token actual en Usuarios.jsx:", token);
    cargarUsuarios();
    cargarRoles(); // Asegura que los roles estén actualizados
    // Si tienes hooks para zonas, llama aquí a cargarZonas()
    // setZonas(await cargarZonas());
  }, []);

  const handleEdit = (usuario) => {
    setShowModal(true);
    setEditMode(true);
    setForm({
      id: usuario.id,
      nombre_completo: usuario.nombre_completo || usuario.nombre,
      nombre_usuario: usuario.nombre_usuario || "",
      contraseña: "",
      rol_id: usuario.rol_id,
      zona_id: usuario.zona_id,
      estado: usuario.estado || "activo",
    });
  };

  const handleCreate = () => {
    setShowModal(true);
    setEditMode(false);
    setForm({
      id: null,
      nombre_completo: "",
      nombre_usuario: "",
      contraseña: "",
      rol_id: "",
      zona_id: "",
      estado: "activo",
    });
  };

  const handleSave = async () => {
    // Validar y enviar solo los datos llenos
    const usuarioPayload = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        usuarioPayload[key] = value;
      }
    });
    if (editMode) {
      await editarUsuario(usuarioPayload);
    } else {
      await crearUsuario(usuarioPayload);
    }
    setShowModal(false);
  };

  return (
    <div className={styles.pageBg} style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)' }}>
      <div className="container py-4" style={{ maxWidth: 1100, margin: '0 auto', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h1 className={styles.panelTitle} style={{ fontWeight: 700, fontSize: 32, color: '#2563eb', marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>Gestión de Usuarios</h1>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button variant="primary" onClick={handleCreate} style={{ fontWeight: 600, fontSize: 18, padding: '8px 24px', borderRadius: 8 }}>
            + Nuevo Usuario
          </Button>
          {error && <div className={styles.error} style={{ color: '#e53e3e', fontWeight: 500 }}>{error}</div>}
        </div>
        <div className="table-responsive mt-3">
          <Table striped bordered hover size="sm" style={{ background: '#f9fafb', borderRadius: 8 }}>
            <thead style={{ background: '#2563eb', color: '#fff', fontWeight: 600 }}>
              <tr>
                <th>ID</th>
                <th>Nombre de usuario</th>
                <th>Nombre completo</th>
                <th>Rol ID</th>
                <th>Zona ID</th>
                <th>Estado</th>
                <th>Fecha registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.nombre_usuario}</td>
                  <td>{u.nombre_completo}</td>
                  <td>{u.rol_id}</td>
                  <td>{u.zona_id}</td>
                  <td>{u.estado}</td>
                  <td>{u.fecha_registro}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" style={{ marginRight: 8, borderRadius: 6 }} onClick={() => handleEdit(u)}>
                      Editar
                    </Button>
                    <Button size="sm" variant="outline-danger" style={{ borderRadius: 6 }} onClick={() => eliminarUsuario(u.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton style={{ background: '#2563eb', color: '#fff' }}>
            <Modal.Title style={{ fontWeight: 700 }}>
              {editMode ? "Editar Usuario" : "Nuevo Usuario"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: '#f8fafc' }}>
            <Form>
              <Form.Group className="mb-2">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  type="text"
                  value={form.nombre_completo}
                  onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })}
                  style={{ borderRadius: 6 }}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Nombre de usuario</Form.Label>
                <Form.Control
                  type="text"
                  value={form.nombre_usuario}
                  onChange={(e) => setForm({ ...form, nombre_usuario: e.target.value })}
                  style={{ borderRadius: 6 }}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={form.contraseña}
                  onChange={(e) => setForm({ ...form, contraseña: e.target.value })}
                  style={{ borderRadius: 6 }}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={form.rol_id}
                  onChange={(e) => setForm({ ...form, rol_id: e.target.value })}
                  style={{ borderRadius: 6 }}
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
                  style={{ borderRadius: 6 }}
                >
                  <option value="">Seleccione...</option>
                  {zonas.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                  style={{ borderRadius: 6 }}
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label>ID</Form.Label>
                <Form.Control
                  type="text"
                  value={form.id || ""}
                  disabled
                  style={{ borderRadius: 6 }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{ background: '#f8fafc' }}>
            <Button variant="secondary" onClick={() => setShowModal(false)} style={{ borderRadius: 6 }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave} style={{ borderRadius: 6 }}>
              {editMode ? "Guardar" : "Crear"}
            </Button>
          </Modal.Footer>
        </Modal>
        <hr />
        <Roles />
      </div>
    </div>
  );
}