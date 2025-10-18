import useRoles from "../../hooks/useRoles";
import styles from "./Usuarios.module.css";
import { Table, Button, Modal, Form, OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { useState, useMemo, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaPlus, FaInfoCircle } from "react-icons/fa";
import { isAuthenticated } from "../../services/api";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import Swal from 'sweetalert2';

const titleFontStyle = {
  fontSize: "12px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
};

const dataFontStyle = {
  fontSize: "10px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "normal",
};

export default function Roles() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const { roles, crearRol, editarRol, eliminarRol, loading: rolesLoading, error: rolesError } = useRoles();
  console.log("🔵 Roles - Estado actual:", { roles: roles?.length, rolesLoading, rolesError });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "" });
  const [editMode, setEditMode] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // Filtros y detalles
  const [filtroNombre, setFiltroNombre] = useState("");
  const [detalleRol, setDetalleRol] = useState(null);

  // Filtra roles por nombre
  const rolesFiltrados = useMemo(() => {
    return roles.filter(r =>
      filtroNombre === "" || r.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );
  }, [roles, filtroNombre]);

  // Escucha el evento para abrir el modal de agregar rol desde Usuarios.jsx
  useEffect(() => {
    const handler = () => {
      setShowModal(true);
      setEditMode(false);
      setForm({ id: null, nombre: "" });
    };
    window.addEventListener("openAddRolModal", handler);
    return () => window.removeEventListener("openAddRolModal", handler);
  }, []);

  const handleSave = async () => {
    setLocalLoading(true);
    setLocalError(null);
    try {
      if (editMode) {
        await editarRol({ id: form.id, nombre: form.nombre });
      } else {
        await crearRol({ nombre: form.nombre });
      }
      setShowModal(false);
    } catch (err) {
      setLocalError("Error al guardar los datos. Inténtalo de nuevo.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className={styles.rolesBox} style={{ position: "relative" }}>
      <LoadingOverlay loading={rolesLoading || localLoading} error={rolesError || localError} />
      <h2 className={styles.panelTitle} style={{ textAlign: 'center', marginBottom: 24, ...titleFontStyle }}>
        Roles
      </h2>
      
      {/* Filtro */}
      <div className="row mb-3">
        <div className="col-12 col-md-6 mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar rol por nombre"
            value={filtroNombre}
            onChange={e => setFiltroNombre(e.target.value)}
            style={dataFontStyle}
          />
        </div>
      </div>
      {/* Tabla con fondo igual a usuarios */}
      <div className={styles.usuariosTableBg} style={{ flex: 1, overflowY: "auto", maxHeight: "100%" }}>
        <Table
          striped
          bordered
          hover
          size="sm"
          className={`w-100 ${styles.usuariosTable}`}
          responsive
        >
          <thead className={styles.usuariosTableHeader}>
            <tr>
              <th className={styles.usuariosTableHeaderCell} style={titleFontStyle}>Rol</th>
              <th className={styles.usuariosTableHeaderCell} style={titleFontStyle}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rolesFiltrados.map((r) => (
              <tr key={r.id} className={styles.usuariosTableRow}>
                <td style={dataFontStyle}>{r.nombre}</td>
                <td className="d-flex gap-2">
                  <OverlayTrigger placement="top" overlay={<Tooltip>Ver detalles</Tooltip>}>
                    <Button
                      size="sm"
                      variant="outline-info"
                      className={styles.usuariosBtnEdit}
                      style={dataFontStyle}
                      onClick={() => setDetalleRol(r)}
                    >
                      <FaInfoCircle />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      className={styles.usuariosBtnEdit}
                      style={dataFontStyle}
                      onClick={() => {
                        setShowModal(true);
                        setEditMode(true);
                        setForm({ id: r.id, nombre: r.nombre });
                      }}
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className={styles.usuariosBtnDelete}
                      style={dataFontStyle}
                      onClick={async () => {
                        const result = await Swal.fire({
                          title: '¿Estás seguro?',
                          text: `Se eliminará el rol "${r.nombre}" permanentemente`,
                          icon: 'warning',
                          showCancelButton: true,
                          confirmButtonColor: '#d33',
                          cancelButtonColor: '#3085d6',
                          confirmButtonText: 'Sí, eliminar',
                          cancelButtonText: 'Cancelar'
                        });

                        if (result.isConfirmed) {
                          eliminarRol(r.id);
                        }
                      }}
                    >
                      <FaTrashAlt />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      {/* Modal de detalles */}
      <Modal show={!!detalleRol} onHide={() => setDetalleRol(null)}>
        <Modal.Header closeButton>
          <Modal.Title style={titleFontStyle}>Detalles de Rol</Modal.Title>
        </Modal.Header>
        <Modal.Body style={dataFontStyle}>
          {detalleRol && (
            <div>
              <p><strong>ID:</strong> {detalleRol.id}</p>
              <p><strong>Nombre:</strong> {detalleRol.nombre}</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
      {/* Modal crear/editar */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className={styles.usuariosModalHeader}>
          <Modal.Title className={styles.usuariosModalTitle} style={titleFontStyle}>
            {editMode ? "Editar Rol" : "Nuevo Rol"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.usuariosModalBody} style={dataFontStyle}>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label style={titleFontStyle}>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                style={{ borderRadius: 6, ...dataFontStyle }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={styles.usuariosModalFooter}>
          <Button variant="secondary" onClick={() => setShowModal(false)} className={styles.usuariosBtn} style={dataFontStyle}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} className={styles.usuariosBtn} style={dataFontStyle}>
            {editMode ? "Guardar" : "Crear"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// El componente está correcto. Solo asegúrate que el hook useRoles y los métodos en services/api.js usen los endpoints:
// - POST /api/roles/crearRoles
// - PUT /api/roles/actualizarRolId/{id}
// - DELETE /api/roles/eliminarRolId/{id}
// - GET /api/roles/obtenerListadoRoles
// - GET /api/roles/obtenerRolId/{id}

