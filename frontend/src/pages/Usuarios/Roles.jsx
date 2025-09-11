import useRoles from "../../hooks/useRoles";
import styles from "./Usuarios.module.css";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { isAuthenticated } from "../../services/api";

export default function Roles() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const { roles, crearRol, editarRol, eliminarRol } = useRoles();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "" });
  const [editMode, setEditMode] = useState(false);

  const handleSave = async () => {
    if (editMode) {
      await editarRol({ id: form.id, nombre: form.nombre });
    } else {
      await crearRol({ nombre: form.nombre });
    }
    setShowModal(false);
  };

  console.log('Roles cargados:', roles);

  return (
    <div className={styles.rolesBox} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 24, marginTop: 32 }}>
      <h2 style={{ fontWeight: 700, fontSize: 28, color: '#2563eb', marginBottom: 24, textAlign: 'center', letterSpacing: 1 }}>Gestión de Roles</h2>
      <Button
        variant="primary"
        onClick={() => {
          setShowModal(true);
          setEditMode(false);
          setForm({ id: null, nombre: "" });
        }}
        style={{ fontWeight: 600, fontSize: 18, padding: '8px 24px', borderRadius: 8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}
      >
        <FaPlus /> Nuevo Rol
      </Button>
      <div className="table-responsive mt-3">
        <Table striped bordered hover size="sm" style={{ background: '#f9fafb', borderRadius: 8 }}>
          <thead style={{ background: '#2563eb', color: '#fff', fontWeight: 600 }}>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.nombre}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    style={{ marginRight: 8, borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    onClick={() => {
                      setShowModal(true);
                      setEditMode(true);
                      setForm({ id: r.id, nombre: r.nombre });
                    }}
                  >
                    <FaEdit /> Editar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    style={{ borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    onClick={() => eliminarRol(r.id)}
                  >
                    <FaTrashAlt /> Eliminar
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
            {editMode ? "Editar Rol" : "Nuevo Rol"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#f8fafc' }}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
    </div>
  );
}
