import { useState, useEffect, useMemo } from "react";
import { FaUser, FaEdit, FaTrashAlt, FaInfoCircle, FaPlus } from "react-icons/fa";
import Roles from "./Roles";
import useUsuarios from "../../hooks/useUsuarios";
import useRoles from "../../hooks/useRoles";
import styles from "./Usuarios.module.css";
import { Table, Button, Modal, Form, OverlayTrigger, Tooltip, Dropdown, Spinner } from "react-bootstrap";
import { isAuthenticated } from "../../services/api";
import LoadingOverlay from "../../components/Common/LoadingOverlay";

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
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  // Filtros
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRol, setFiltroRol] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [detalleUsuario, setDetalleUsuario] = useState(null);

  // Filtra usuarios según los filtros
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u =>
      (filtroNombre === "" || u.nombre_completo?.toLowerCase().includes(filtroNombre.toLowerCase()) || u.nombre_usuario?.toLowerCase().includes(filtroNombre.toLowerCase())) &&
      (filtroRol === "" || String(u.roles?.id) === filtroRol) &&
      (filtroEstado === "" || (u.estado?.toLowerCase() === filtroEstado.toLowerCase()))
    );
  }, [usuarios, filtroNombre, filtroRol, filtroEstado]);

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
    <div className={`${styles.pageBg} container-fluid`}>
      <div className={`${styles.usuariosContainer} row mx-auto`} style={{ position: "relative" }}>
        <LoadingOverlay loading={loading} error={error} />
        <div className="col-12">
          <div className={`d-flex align-items-center ${styles.usuariosHeader}`}>
            <FaUser className={styles.usuariosHeaderIcon} />
            <h1 className={styles.panelTitle}>Admin: </h1>
          </div>
          {/* Filtros */}
          <div className="row mb-3">
            <div className="col-12 col-md-4 mb-2 mb-md-0">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre o usuario"
                value={filtroNombre}
                onChange={e => setFiltroNombre(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-4 mb-2 mb-md-0">
              <select
                className="form-select"
                value={filtroRol}
                onChange={e => setFiltroRol(e.target.value)}
              >
                <option value="">Todos los roles</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-4 d-flex align-items-center justify-content-end">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="add-tooltip">Agregar usuario o rol</Tooltip>}
              >
                <Dropdown
                  show={showAddDropdown}
                  onToggle={(isOpen) => setShowAddDropdown(isOpen)}
                  className="mb-0"
                >
                  <Dropdown.Toggle
                    variant="primary"
                    className={styles.usuariosBtn}
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    id="dropdown-add"
                    aria-label="Agregar"
                  >
                    <FaPlus />
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
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
                        setShowAddDropdown(false);
                      }}
                    >
                      <FaPlus style={{ marginRight: 6 }} />
                      Agregar Usuario
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        window.dispatchEvent(new CustomEvent("openAddRolModal"));
                        setShowAddDropdown(false);
                      }}
                    >
                      <FaPlus style={{ marginRight: 6 }} />
                      Agregar Rol
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </OverlayTrigger>
            </div>
          </div>
          <div className={`d-flex flex-wrap justify-content-center align-items-center ${styles.usuariosActions}`}>
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-12 col-lg-7 d-flex flex-column" style={{ height: "70vh", minHeight: 350 }}>
              <div className="table-responsive" style={{ flex: 1, overflowY: "auto", maxHeight: "100%" }}>
                <div className={styles.usuariosTableBg}>
                  <Table
                    striped
                    bordered
                    hover
                    size="sm"
                    className={`${styles.usuariosTable} w-100`}
                    responsive
                  >
                    <thead className={styles.usuariosTableHeader}>
                      <tr>
                        <th className={styles.usuariosTableHeaderCell}>Usuario</th>
                        <th>Correo</th>
                        <th className={styles.usuariosTableHeaderCell}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((u) => (
                        <tr key={u.id} className={styles.usuariosTableRow}>
                          <td>{u.nombre_completo}</td>
                          <td>{u.nombre_usuario}</td>
                          <td className="d-flex gap-2">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Ver detalles</Tooltip>}>
                              <Button
                                size="sm"
                                variant="outline-info"
                                className={styles.usuariosBtnEdit}
                                onClick={() => setDetalleUsuario(u)}
                              >
                                <FaInfoCircle />
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Editar</Tooltip>}>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                className={styles.usuariosBtnEdit}
                                onClick={() => handleEdit(u)}
                              >
                                <FaEdit />
                              </Button>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Eliminar</Tooltip>}>
                              <Button
                                size="sm"
                                variant="outline-danger"
                                className={styles.usuariosBtnDelete}
                                onClick={() => {
                                  if (window.confirm("¿Estás seguro que deseas eliminar este usuario? Esta acción no se puede deshacer.")) {
                                    eliminarUsuario(u.id);
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
              </div>
            </div>
            {/* Roles panel al lado */}
            <div className="col-12 col-lg-5 d-flex flex-column" style={{ height: "70vh", minHeight: 350 }}>
              <div style={{ flex: 1, overflowY: "auto", maxHeight: "100%" }}>
                <Roles />
              </div>
            </div>
          </div>
          {/* Modal de detalles */}
          <Modal show={!!detalleUsuario} onHide={() => setDetalleUsuario(null)}>
            <Modal.Header closeButton>
              <Modal.Title>Detalles de Usuario</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {detalleUsuario && (
                <div>
                  <p><strong>ID:</strong> {detalleUsuario.id}</p>
                  <p><strong>Nombre completo:</strong> {detalleUsuario.nombre_completo}</p>
                  <p><strong>Correo:</strong> {detalleUsuario.nombre_usuario}</p>
                  <p><strong>Rol:</strong> {detalleUsuario.roles?.nombre || detalleUsuario.rol_id}</p>
                  <p><strong>Zona:</strong> {detalleUsuario.zonas?.nombre || detalleUsuario.zona_id || "Sin zona"}</p>
                  <p><strong>Estado:</strong> {detalleUsuario.estado}</p>
                  <p><strong>Fecha registro:</strong> {detalleUsuario.fecha_registro}</p>
                </div>
              )}
            </Modal.Body>
          </Modal>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton className={styles.usuariosModalHeader}>
              <Modal.Title className={styles.usuariosModalTitle}>
                {editMode ? "Editar Usuario" : "Nuevo Usuario"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.usuariosModalBody}>
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
            <Modal.Footer className={styles.usuariosModalFooter}>
              <Button variant="secondary" onClick={() => setShowModal(false)} className={styles.usuariosBtn}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSave} className={styles.usuariosBtn}>
                {editMode ? "Guardar" : "Crear"}
              </Button>
            </Modal.Footer>
          </Modal>
          <hr />
        </div>
      </div>
    </div>
  );
}