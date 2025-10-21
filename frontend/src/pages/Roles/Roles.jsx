import useRoles from "../../hooks/useRoles";
import styles from "./Roles.module.css";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { useState, useMemo, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { isAuthenticated } from "../../services/api";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import Swal from 'sweetalert2';
import RolesTable from "../../components/Users/RolesTable";
import RolesFilter from "../../components/Users/RolesFilter";

const titleFontStyle = {
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "bold",
};

const dataFontStyle = {
  fontSize: "14px",
  fontFamily: "Arial, sans-serif",
  fontWeight: "normal",
};

export default function Roles() {
  if (!isAuthenticated()) {
    window.location.href = "/login";
    return null;
  }

  const { roles, crearRol, editarRol, eliminarRol, loading: rolesLoading, error: rolesError } = useRoles();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "" });
  const [editMode, setEditMode] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [onDelete, setOnDelete] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [detalleRol, setDetalleRol] = useState(null);

  const rolesFiltrados = useMemo(() => {
    return roles.filter(r =>
      filtroNombre === "" || r.nombre.toLowerCase().includes(filtroNombre.toLowerCase())
    );
  }, [roles, filtroNombre]);

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

  const handleDelete = async (rol) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará el rol "${rol.nombre}" permanentemente`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      eliminarRol(rol.id);
    }
  };

  return (
    <div className={`${styles.pageBg} container-fluid`}>
      <div className={`${styles.usuariosContainer} mx-auto`}>
        <LoadingOverlay loading={rolesLoading || localLoading} error={rolesError || localError} />
        <div className={styles.usuariosHeader}>
          <div className="d-flex align-items-center flex-wrap gap-3">
            <FaUser className={styles.usuariosHeaderIcon} />
            <div className="flex-grow-1">
              <h1 className={styles.panelTitle}>Panel de Administración</h1>
              <p className="mb-0 text-muted" style={{ fontSize: "var(--font-size-small)", opacity: 0.8 }}>
                Gestión de roles
              </p>
            </div>
          </div>
        </div>

        <RolesFilter
          filtroNombre={filtroNombre}
          setFiltroNombre={setFiltroNombre}
          onAddRole={() => {
            setShowModal(true);
            setEditMode(false);
            setForm({ id: null, nombre: "" });
          }}
        />

        <RolesTable
          roles={rolesFiltrados}
          onEdit={(rol) => {
            setShowModal(true);
            setEditMode(true);
            setForm({ id: rol.id, nombre: rol.nombre });
          }}
          onDelete={handleDelete}
          onViewDetails={setDetalleRol}
        />
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
    </div>
  );
}


