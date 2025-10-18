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
import RegisterModal from "../../components/Auth/RegisterModal";
import { getCurrentUserFromToken } from "../../utils/tokenUtils";

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
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

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
    
    // Obtener usuario del token JWT (más seguro)
    const userFromToken = getCurrentUserFromToken();
    const userName = userFromToken?.nombreUsuario || 
                     localStorage.getItem("currentUser") || 
                     "Administrador";
    
    console.log("🔵 Usuario actual:", userName);
    setCurrentUser(userName);
    
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

  // Escuchar eventos de éxito de creación de rol
  useEffect(() => {
    const handleRolCreated = () => {
      console.log("🔵 Evento rolCreated recibido en Usuarios.jsx");
      
      // Recargar roles después de crear uno nuevo
      cargarRoles();
      
      // Mostrar notificación de éxito
      Swal.fire({
        icon: 'success',
        title: 'Rol creado',
        text: 'El rol ha sido creado exitosamente',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    };

    // Escuchar ambos eventos posibles
    window.addEventListener("rolCreated", handleRolCreated);
    window.addEventListener("rolCreatedSuccess", handleRolCreated);

    console.log("🔵 Event listeners para rol creado registrados");

    return () => {
      window.removeEventListener("rolCreated", handleRolCreated);
      window.removeEventListener("rolCreatedSuccess", handleRolCreated);
    };
  }, []);

  // Escuchar el evento para abrir RegisterModal
  useEffect(() => {
    const handleOpenRegisterModal = () => {
      setShowRegisterModal(true);
    };

    window.addEventListener("openRegisterModal", handleOpenRegisterModal);

    return () => {
      window.removeEventListener("openRegisterModal", handleOpenRegisterModal);
    };
  }, []);

  const titleFontStyle = {
    fontSize: "12px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
  };

  const dataFontStyle = {
    fontSize: "12px", // Cambiado a 12px
    fontFamily: "Arial, sans-serif",
    fontWeight: "normal",
  };

  const globalFontStyle = {
    fontSize: "12px",
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div className={`${styles.pageBg} container-fluid`} style={dataFontStyle}>
      <div className={`${styles.usuariosContainer} row mx-auto`} style={{ position: "relative" }}>
        <LoadingOverlay loading={loading || editandoUsuario} error={error} />
        
        <div className="col-12">
          <div className={`d-flex align-items-center ${styles.usuariosHeader}`}>
            <FaUser className={styles.usuariosHeaderIcon} />
            <h1 className={styles.panelTitle} style={titleFontStyle}>
              Admin: {currentUser}
            </h1>
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
                style={dataFontStyle}
              />
            </div>
            <div className="col-6 col-md-4 mb-2 mb-md-0">
              <select
                className="form-select"
                value={filtroRol}
                onChange={e => setFiltroRol(e.target.value)}
                style={dataFontStyle}
              >
                <option value="">Todos los roles</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div className="col-6 col-md-4 d-flex align-items-center justify-content-end gap-2">
              {/* Botón independiente para agregar usuario */}
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="add-user-tooltip">Agregar Usuario</Tooltip>}
              >
                <Button
                  variant="success"
                  className={styles.usuariosBtn}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, ...dataFontStyle }}
                  onClick={() => setShowRegisterModal(true)}
                >
                  <FaPlus />
                  Usuario
                </Button>
              </OverlayTrigger>

              {/* Botón para agregar rol */}
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip id="add-rol-tooltip">Agregar Rol</Tooltip>}
              >
                <Button
                  variant="primary"
                  className={styles.usuariosBtn}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, ...dataFontStyle }}
                  onClick={() => window.dispatchEvent(new CustomEvent("openAddRolModal"))}
                >
                  <FaPlus />
                  Rol
                </Button>
              </OverlayTrigger>
            </div>
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
                        <th className={styles.usuariosTableHeaderCell} style={titleFontStyle}>Usuario</th>
                        <th className={styles.usuariosTableHeaderCell} style={titleFontStyle}>Correo</th>
                        <th className={styles.usuariosTableHeaderCell} style={titleFontStyle}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map((u) => (
                        <tr key={u.id} className={styles.usuariosTableRow}>
                          <td style={dataFontStyle}>{u.nombre_completo}</td>
                          <td style={dataFontStyle}>{u.nombre_usuario}</td>
                          <td className="d-flex gap-2">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Ver detalles</Tooltip>}>
                              <Button
                                size="sm"
                                variant="outline-info"
                                className={styles.usuariosBtnEdit}
                                style={dataFontStyle}
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
                                style={dataFontStyle}
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
                                style={dataFontStyle}
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
            <div className="col-12 col-lg-5 d-flex flex-column" style={{ height: "70vh", minHeight: 350 }}>
              <div style={{ flex: 1, overflowY: "auto", maxHeight: "100%" }}>
                <Roles />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}