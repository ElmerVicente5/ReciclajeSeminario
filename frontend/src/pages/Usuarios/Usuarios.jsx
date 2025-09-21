import { useState, useEffect, useMemo } from "react";
import { FaUser, FaEdit, FaTrashAlt, FaInfoCircle, FaPlus } from "react-icons/fa";
import Roles from "./Roles";
import useUsuarios from "../../hooks/useUsuarios";
import useRoles from "../../hooks/useRoles";
import useZonasSelector from "../../hooks/useZonasSelector";
import styles from "./Usuarios.module.css";
import { Table, Button, Modal, Form, OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import { isAuthenticated } from "../../services/api";
import LoadingOverlay from "../../components/Common/LoadingOverlay";
import Swal from 'sweetalert2';
import useEditarUsuario from "../../hooks/useEditarUsuario";

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
  } = useUsuarios();

  const { roles, cargarRoles } = useRoles();
  const { zonas, cargarZonas, loading: zonasLoading, error: zonasError } = useZonasSelector();

  console.log("🔵 Usuarios - Estado actual:", { usuarios: usuarios?.length, loading, error });
  console.log("🔵 Zonas Selector - Estado actual:", { zonas: zonas?.length, zonasData: zonas });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre_completo: "",
    nombre_usuario: "",
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
    cargarRoles();
    cargarZonas();
  }, []);

  const handleEdit = (usuario) => {
    setShowModal(true);
    setEditMode(true);
    setForm({
      id: usuario.id,
      nombre_completo: usuario.nombre_completo || usuario.nombre,
      nombre_usuario: usuario.nombre_usuario || "",
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
      rol_id: "",
      zona_id: "",
      estado: "activo",
    });
  };

  const { editarUsuario: editarUsuarioAPI, loading: editandoUsuario } = useEditarUsuario();

  const handleSave = async () => {
    // Verificar campos vacíos para modo edición
    const camposVacios = [];
    if (!form.nombre_completo) camposVacios.push("Nombre completo");
    if (!form.nombre_usuario) camposVacios.push("Nombre de usuario");
    if (!form.rol_id) camposVacios.push("Rol");
    if (!form.zona_id) camposVacios.push("Zona");

    // Si hay campos vacíos en modo edición, mostrar confirmación
    if (camposVacios.length > 0 && editMode) {
      const result = await Swal.fire({
        title: '¿Campos vacíos detectados?',
        text: `Los siguientes campos están vacíos: ${camposVacios.join(", ")}. ¿Estás seguro que quieres guardar?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) {
        return;
      }
    }

    try {
      if (editMode) {
        // Usar el nuevo hook para editar usuario
        await editarUsuarioAPI(form);
        // Recargar la lista de usuarios después de editar
        await cargarUsuarios();
      } else {
        // Preparar payload para crear usuario
        const usuarioPayload = {};
        Object.entries(form).forEach(([key, value]) => {
          if (value !== "" && value !== null && value !== undefined) {
            usuarioPayload[key] = value;
          }
        });
        await crearUsuario(usuarioPayload);
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      // El error ya se maneja en el hook useEditarUsuario
    }
  };

  return (
    <div className={`${styles.pageBg} container-fluid`}>
      <div className={`${styles.usuariosContainer} row mx-auto`} style={{ position: "relative" }}>
        <LoadingOverlay loading={loading || editandoUsuario} error={error} />
        
            {/* Debug info
            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '12px', background: '#f0f0f0', padding: '5px', zIndex: 50 }}>
            Debug: Usuarios: {usuarios?.length || 0}, Loading: {loading ? 'Sí' : 'No'}, Error: {error || 'Ninguno'}
            </div> */}
        
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
            {/* ELIMINAR - Ya no necesitamos mostrar error aquí porque LoadingOverlay lo maneja */}
            {/* {error && (
              <div className={styles.error}>
                {error}
              </div>
            )} */}
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
                                onClick={async () => {
                                  const result = await Swal.fire({
                                    title: '¿Estás seguro?',
                                    text: `Se eliminará el usuario "${u.nombre_completo}" permanentemente`,
                                    icon: 'warning',
                                    showCancelButton: true,
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                    confirmButtonText: 'Sí, eliminar',
                                    cancelButtonText: 'Cancelar'
                                  });

                                  if (result.isConfirmed) {
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
                    {zonasLoading && <option disabled>Cargando zonas...</option>}
                    {zonasError && <option disabled>Error al cargar zonas</option>}
                    {Array.isArray(zonas) && zonas.length > 0 ? (
                      zonas.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.nombre} ({z.codigo})
                        </option>
                      ))
                    ) : (
                      !zonasLoading && !zonasError && <option disabled>No hay zonas disponibles</option>
                    )}
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