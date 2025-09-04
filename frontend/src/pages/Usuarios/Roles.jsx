import useRoles from "../../hooks/useRoles";
import styles from "./Usuarios.module.css";
import { Table, Button, Modal, Form } from "react-bootstrap";
import { useState } from "react";

export default function Roles() {
  const { roles, crearRol, editarRol, eliminarRol } = useRoles();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "" });
  const [editMode, setEditMode] = useState(false);

  return (
    <div className={styles.rolesBox}>
      <h2>Gestión de Roles</h2>
      <Button
        variant="primary"
        onClick={() => {
          setShowModal(true);
          setEditMode(false);
          setForm({ id: null, nombre: "" });
        }}
      >
        Nuevo Rol
      </Button>
      <div className="table-responsive mt-3">
        <Table striped bordered hover size="sm">
          <thead>
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
                    onClick={() => {
                      setShowModal(true);
                      setEditMode(true);
                      setForm(r);
                    }}
                  >
                    Editar
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => eliminarRol(r.id)}
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
          <Modal.Title>{editMode ? "Editar Rol" : "Nuevo Rol"}</Modal.Title>
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              editMode ? editarRol(form) : crearRol(form);
              setShowModal(false);
            }}
          >
            {editMode ? "Guardar" : "Crear"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
