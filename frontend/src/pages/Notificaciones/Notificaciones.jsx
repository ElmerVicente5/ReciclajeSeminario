import { useState, useEffect } from "react";
import { Button, Form, ListGroup, Card, Badge, OverlayTrigger, Popover, Alert } from "react-bootstrap";
import styles from "./Notificaciones.module.css";
import DashboardSidebar from "../Dashboard/DashboardSidebar";
import { useNotificaciones } from "../../hooks/useNotificaciones";
import { isAuthenticated } from "../../services/api";

// Obtener usuario actual del localStorage Y del token
const getUsuarioActual = () => {
  try {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    // Eliminar todos los console.log de debug
    // console.log('=== DATOS DEL USUARIO LOGUEADO ===');
    // console.log('UserData del localStorage:', userData);
    // console.log('Token presente:', !!token);
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // console.log('Payload completo del token:', payload);
        
        // El ID del usuario autenticado debería estar en el payload del token
        const userId = payload.userId || payload.id || payload.sub;
        const tokenRole = payload.rol || payload.role || "USER";
        if (userData) {
          const user = JSON.parse(userData);
          const userRole = tokenRole.toUpperCase();
          return {
            id: userId || user.id,
            rol: userRole.toLowerCase(),
            esAdmin: userRole === "ADMIN" || userRole === "ADMINISTRADOR",
            puedeCrear: true,
            tipoToken: userRole === "ADMIN" || userRole === "ADMINISTRADOR" ? 'admin' : 'app',
            nombre: user.nombre_completo || user.nombre_usuario || payload.nombre_completo || payload.nombre_usuario || "Usuario",
            tokenPayload: payload,
            userFromStorage: user
          };
        } else {
          const userRole = tokenRole.toUpperCase();
          return {
            id: userId,
            rol: userRole.toLowerCase(),
            esAdmin: userRole === "ADMIN" || userRole === "ADMINISTRADOR",
            puedeCrear: true,
            tipoToken: userRole === "ADMIN" || userRole === "ADMINISTRADOR" ? 'admin' : 'app',
            nombre: payload.nombre_completo || payload.nombre_usuario || payload.name || payload.username || "Usuario",
            tokenPayload: payload
          };
        }
      } catch (tokenError) {
        // console.error('Error decodificando token:', tokenError);
      }
    }
    
    if (userData) {
      const user = JSON.parse(userData);
      const userRole = user.roles?.[0]?.nombre?.toUpperCase() || "USER";
      return {
        id: user.id || 1,
        rol: userRole.toLowerCase(),
        esAdmin: userRole === "ADMIN",
        puedeCrear: true, // Todos pueden crear
        tipoToken: 'app',
        nombre: user.nombre_completo || user.nombre_usuario || "Usuario",
        userFromStorage: user
      };
    }
  } catch (error) {
    // console.error('Error obteniendo datos de usuario:', error);
  }
  
  return {
    id: 1,
    rol: "user",
    esAdmin: false,
    puedeCrear: true, // Todos pueden crear
    tipoToken: 'app',
    nombre: "Usuario",
  };
};

export default function Notificaciones() {
    // Verificar autenticación
    if (!isAuthenticated()) {
        window.location.href = "/login";
        return null;
    }

    const usuarioActual = getUsuarioActual();
    const [notificaciones, setNotificaciones] = useState([]); // Empezar con array vacío
    const [mensaje, setMensaje] = useState("");
    const [toastBubble, setToastBubble] = useState({ show: false, mensaje: "", autor: "", fecha: "", id: null });
    const [titulo, setTitulo] = useState("");
    const [cuerpo, setCuerpo] = useState("");
    const [tipo, setTipo] = useState("ALERTA");
    const [programadaEn, setProgramadaEn] = useState(new Date().toISOString().slice(0, 16));
    const [tipoAudiencia, setTipoAudiencia] = useState("TODOS");
    const [objetivoId, setObjetivoId] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const { getNotificaciones, createNotificacion } = useNotificaciones();

    // Mostrar notificación en otras pestañas usando localStorage events
    useEffect(() => {
        const handleStorage = (e) => {
            if (e.key === "nuevaNotificacion" && e.newValue) {
                const data = JSON.parse(e.newValue);
                setNotificaciones((prev) => [
                    { id: data.id, mensaje: data.mensaje, fecha: data.fecha, autor: data.autor },
                    ...prev,
                ]);
                setToastBubble({ show: true, mensaje: data.mensaje, autor: data.autor, fecha: data.fecha, id: data.id });
                // Opcional: mostrar notificación nativa
                if (window.Notification && Notification.permission === "granted") {
                    new Notification(`Notificación: ${data.mensaje}`);
                }
            }
        };
        window.addEventListener("storage", handleStorage);
        // Solicitar permiso para notificaciones nativas
        if (window.Notification && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    useEffect(() => {
        // Verificar token antes de cargar notificaciones
        const token = localStorage.getItem('token');
        if (!token) {
            setError("No hay token de autenticación. Redirigiendo al login...");
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
            return;
        }

        // Cargar notificaciones desde la API al montar
        const cargarNotificaciones = async () => {
            setLoading(true);
            try {
                const res = await getNotificaciones();
                if (Array.isArray(res)) {
                    setNotificaciones(res);
                } else {
                    setError("Formato de datos inesperado del servidor");
                }
            } catch (err) {
                if (err.message.includes('401') || err.message.includes('Unauthorized')) {
                    setError("Sesión expirada. Redirigiendo al login...");
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = "/login";
                    }, 2000);
                } else {
                    setError(`Error cargando notificaciones: ${err.message}`);
                }
            } finally {
                setLoading(false);
            }
        };
        cargarNotificaciones();
    }, [getNotificaciones]);

    const handleCrear = async () => {
        if (!usuarioActual.esAdmin) {
            setError("Solo los administradores pueden crear notificaciones.");
            return;
        }

        if (titulo.trim() === "" || cuerpo.trim() === "") {
            setError("El título y el cuerpo son obligatorios");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        const audiencia = [];
        if (tipoAudiencia === "TODOS") {
            audiencia.push({
                tipo_objetivo: "TODOS",
                objetivo_id: null
            });
        } else {
            if (!objetivoId) {
                setError("Debe especificar el ID del objetivo para la audiencia seleccionada");
                setLoading(false);
                return;
            }
            audiencia.push({
                tipo_objetivo: tipoAudiencia,
                objetivo_id: parseInt(objetivoId)
            });
        }

        const nueva = {
            titulo,
            cuerpo,
            tipo,
            creadoPor: usuarioActual.id,
            programadaEn: new Date(programadaEn).toISOString(),
            audiencia,
        };

        try {
            const result = await createNotificacion(nueva);
            setSuccess(`Notificación "${titulo}" creada exitosamente!`);
            setTitulo("");
            setCuerpo("");
            setMensaje("");
            setTipoAudiencia("TODOS");
            setObjetivoId("");
            const nuevaParaStorage = {
                id: Date.now(),
                titulo,
                mensaje: cuerpo,
                autor: usuarioActual.nombre,
                fecha: new Date().toLocaleString(),
                tipo
            };
            localStorage.setItem("nuevaNotificacion", JSON.stringify(nuevaParaStorage));
            setTimeout(() => localStorage.removeItem("nuevaNotificacion"), 500);
            setTimeout(() => {
                setSuccess("");
            }, 5000);
        } catch (err) {
            if (err.message.includes('401') || err.message.includes('Unauthorized')) {
                setError("No tiene permisos para crear notificaciones. Inicie sesión como administrador.");
            } else {
                setError(`Error al crear notificación: ${err.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // Burbuja tipo Facebook para nueva notificación
    const popover = (
        <Popover id="popover-notificacion" style={{ minWidth: 260, fontSize: "12px" }}>
            <Popover.Header as="h3" style={{ fontSize: "12px" }}>Nueva Notificación</Popover.Header>
            <Popover.Body>
                <Badge bg="secondary" className="me-2" style={{ fontSize: "12px" }}>{toastBubble.autor}</Badge>
                <div className="mb-2" style={{ fontSize: "12px" }}>{toastBubble.mensaje}</div>
                <div className="text-end text-muted" style={{ fontSize: "12px" }}>{toastBubble.fecha}</div>
                <Button
                    size="sm"
                    variant="primary"
                    className="mt-2 w-100"
                    style={{ fontSize: "12px" }}
                    onClick={() => setToastBubble({ ...toastBubble, show: false })}
                >
                    Ver mensaje
                </Button>
            </Popover.Body>
        </Popover>
    );

    // Función para recargar notificaciones manualmente
    const recargarNotificaciones = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getNotificaciones();
            if (Array.isArray(res)) {
                setNotificaciones(res);
                setSuccess(`Notificaciones recargadas: ${res.length} encontradas`);
                setTimeout(() => {
                    setSuccess("");
                }, 3000);
            }
        } catch (err) {
            setError(`Error al recargar: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Nuevo estado para notificaciones admin
    const [notificacionesAdmin, setNotificacionesAdmin] = useState([]);
    const [loadingAdmin, setLoadingAdmin] = useState(false);
    const [errorAdmin, setErrorAdmin] = useState("");

    // Hook para obtener notificaciones solo para admin
    const obtenerNotificacionesAdmin = async () => {
        setLoadingAdmin(true);
        setErrorAdmin("");
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("No hay token admin");
            const response = await fetch("http://localhost:8000/api/notificaciones/obtenerNotificaciones", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            if (!Array.isArray(data)) throw new Error("La API no devolvió un array de notificaciones");
            const notifs = data.map((n, idx) => ({
                id: n.id || idx + 1,
                titulo: n.titulo || 'Sin título',
                mensaje: n.cuerpo || 'Sin contenido',
                tipo: n.tipo || 'INFORMATIVA',
                fecha: n.enviada_en ?
                    new Date(n.enviada_en).toLocaleString() :
                    n.programada_en ?
                        new Date(n.programada_en).toLocaleString() :
                        'Sin fecha',
                autor: n.creado_por?.nombre_completo || n.creado_por?.nombre_usuario || 'Sistema',
                audiencia: n.audiencia || [],
                programada_en: n.programada_en,
                enviada_en: n.enviada_en
            }));
            setNotificacionesAdmin(notifs);
        } catch (err) {
            setErrorAdmin(err.message || "Error obteniendo notificaciones admin");
            setNotificacionesAdmin([]);
        } finally {
            setLoadingAdmin(false);
        }
    };

    // Cargar notificaciones admin solo si es admin
    useEffect(() => {
        if (usuarioActual.esAdmin) {
            obtenerNotificacionesAdmin();
        } else {
            recargarNotificaciones();
        }
    }, [usuarioActual.esAdmin]);

    return (
        <div className={styles.notificacionesBg}>
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <div className="col-12 col-md-3 col-lg-2 p-0" style={{ minHeight: "100vh" }}>
                        <DashboardSidebar />
                    </div>
                    {/* Panel de notificaciones */}
                    <div className="col-12 col-md-9 col-lg-10 d-flex flex-column" style={{ minHeight: 350 }}>
                        <div className={styles.notificacionesContainer}>
              
              {/* Burbuja tipo Facebook arriba a la derecha */}
              {toastBubble.show && (
                <OverlayTrigger
                  trigger="click"
                  placement="top"
                  show={toastBubble.show}
                  overlay={popover}
                  rootClose
                  onHide={() => setToastBubble({ ...toastBubble, show: false })}
                >
                  <div
                    style={{
                      position: "fixed",
                      top: 24,
                      right: 32,
                      zIndex: 9999,
                      cursor: "pointer",
                      background: "#2563eb",
                      color: "#fff",
                      borderRadius: "50%",
                      width: 54,
                      height: 54,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 4px 16px #2563eb55",
                      fontSize: 26,
                    }}
                    onClick={() => setToastBubble({ ...toastBubble, show: false })}
                    title="Ver notificación"
                  >
                    <span role="img" aria-label="notificación">🔔</span>
                  </div>
                </OverlayTrigger>
              )}
              
              <Card className={styles.panelCard}>
                <Card.Header className={styles.panelHeader}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Panel de Notificaciones</h4>
                    <div className="d-flex align-items-center gap-2">
                      <Badge
                        bg="secondary"
                        style={{ fontSize: "0.8rem", padding: "4px 8px" }}
                        title={`ID de usuario: ${usuarioActual.id}`}
                      >
                        {usuarioActual.nombre}
                      </Badge>
                      <Badge
                        bg="primary"
                        style={{ fontSize: "1rem", padding: "8px 16px" }}
                      >
                        {usuarioActual.esAdmin ? "Admin" : "Usuario"}
                      </Badge>
                    </div>
                  </div>
                </Card.Header>

                <Card.Body>
                  {/* Mensaje de éxito */}
                  {success && (
                    <Alert variant="success" className="mb-3" dismissible onClose={() => setSuccess("")}>
                      <div className="d-flex align-items-center">
                        <i className="fas fa-check-circle me-2"></i>
                        <div>
                          <strong>¡Éxito!</strong> {success}
                        </div>
                      </div>
                    </Alert>
                  )}

                  {/* Estado de carga */}
                  {loading && (
                    <Alert variant="info" className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="spinner-border spinner-border-sm me-3" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                        <div>
                          <strong>🔄 Cargando Notificaciones...</strong>
                          <br />
                          <small>Obteniendo datos del servidor...</small>
                        </div>
                      </div>
                    </Alert>
                  )}

                  {/* MOSTRAR PANEL DE CREACIÓN - TODOS pueden crear */}
                  <div>
                    <Form className={styles.nuevaForm}>
                      <Form.Control
                        type="text"
                        placeholder="Título de la notificación"
                        value={titulo}
                        onChange={e => setTitulo(e.target.value)}
                        maxLength={120}
                        className="mb-2"
                        style={{ fontSize: "12px" }}
                        disabled={loading}
                      />
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Cuerpo de la notificación"
                        value={cuerpo}
                        onChange={e => setCuerpo(e.target.value)}
                        maxLength={240}
                        className="mb-2"
                        style={{ fontSize: "12px" }}
                        disabled={loading}
                      />
                      
                      <div className="row">
                        <div className="col-md-6">
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: "12px" }}>Tipo de Notificación</Form.Label>
                            <Form.Select
                              value={tipo}
                              onChange={e => setTipo(e.target.value)}
                              disabled={loading}
                              style={{ fontSize: "12px" }}
                            >
                              <option value="ALERTA">🚨 Alerta</option>
                              <option value="NOTIFICACION">📢 Notificación</option>
                              <option value="INFORMATIVA">ℹ️ Informativa</option>
                              <option value="PROMOCIONAL">🎁 Promocional</option>
                            </Form.Select>
                          </Form.Group>
                        </div>
                        <div className="col-md-6">
                          <Form.Group className="mb-2">
                            <Form.Label>Programar para:</Form.Label>
                            <Form.Control
                              type="datetime-local"
                              value={programadaEn}
                              onChange={e => setProgramadaEn(e.target.value)}
                              disabled={loading}
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: "12px" }}>Audiencia</Form.Label>
                            <Form.Select
                              value={tipoAudiencia}
                              onChange={e => {
                                setTipoAudiencia(e.target.value);
                                setObjetivoId(""); // Limpiar objetivo al cambiar tipo
                              }}
                              disabled={loading}
                            >
                              <option value="TODOS">Todos los Usuarios</option>
                              <option value="ZONA"> Zona Específica</option>
                              <option value="ROL">Rol Específico</option>
                              <option value="USUARIO">Usuario Específico</option>
                            </Form.Select>
                          </Form.Group>
                        </div>
                        {tipoAudiencia !== "TODOS" && (
                          <div className="col-md-6">
                            <Form.Group className="mb-2">
                              <Form.Label>
                                ID del {tipoAudiencia === "ZONA" ? "Zona" : 
                                       tipoAudiencia === "ROL" ? "Rol" : "Usuario"}
                              </Form.Label>
                              <Form.Control
                                type="number"
                                placeholder={`ID del ${tipoAudiencia.toLowerCase()}`}
                                value={objetivoId}
                                onChange={e => setObjetivoId(e.target.value)}
                                disabled={loading}
                              />
                              <Form.Text className="text-muted">
                                <small>
                                  {tipoAudiencia === "ZONA" && "Ej: 1 para Zona Norte"}
                                  {tipoAudiencia === "ROL" && "Ej: 1 para Administradores, 2 para Usuarios"}
                                  {tipoAudiencia === "USUARIO" && "ID específico del usuario"}
                                </small>
                              </Form.Text>
                            </Form.Group>
                          </div>
                        )}
                      </div>

                      <Button 
                        variant="success" 
                        onClick={handleCrear}
                        disabled={loading || !titulo.trim() || !cuerpo.trim() || 
                                 (tipoAudiencia !== "TODOS" && !objetivoId)}
                        className="d-flex align-items-center w-100"
                      >
                        {loading && (
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Enviando...</span>
                          </div>
                        )}
                        <i className="fas fa-paper-plane me-2"></i>
                        {loading ? 'Enviando...' : `Enviar Notificación (${usuarioActual.tipoToken.toUpperCase()})`}
                      </Button>
                    </Form>
                  </div>
                  
                  <hr className="my-4" />
                  
                  {/* SOLO ADMIN: Panel de notificaciones admin */}
                  {usuarioActual.esAdmin && (
                    <Card className="mb-4">
                      <Card.Header className="bg-danger text-white">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>🔔 Notificaciones </span>
                          <Button
                            size="sm"
                            variant="outline-light"
                            onClick={obtenerNotificacionesAdmin}
                            disabled={loadingAdmin}
                          >
                            {loadingAdmin ? (
                              <>
                                <div className="spinner-border spinner-border-sm me-1" role="status"></div>
                                Cargando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-sync-alt me-1"></i>
                                Recargar
                              </>
                            )}
                          </Button>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        {errorAdmin && (
                          <Alert variant="danger" className="mb-3">
                            <strong>Error:</strong> {errorAdmin}
                            <br />
                            <small>
                              Verifique que el token sea de admin y que el backend esté corriendo.<br />
                              Endpoint: <code>/api/notificaciones/obtenerNotificaciones</code>
                            </small>
                          </Alert>
                        )}
                        {loadingAdmin && (
                          <div className="text-center py-4">
                            <div className="spinner-border text-danger" role="status"></div>
                            <div className="mt-2">Cargando notificaciones admin...</div>
                          </div>
                        )}
                        {!loadingAdmin && notificacionesAdmin.length === 0 && !errorAdmin && (
                          <div className="text-center text-muted py-4">
                            <i className="fas fa-bell-slash fa-2x mb-2 d-block"></i>
                            <div>No hay notificaciones admin disponibles</div>
                            <small>Las notificaciones aparecerán aquí cuando se creen</small>
                          </div>
                        )}
                        {!loadingAdmin && notificacionesAdmin.length > 0 && (
                          <ListGroup variant="flush">
                            {notificacionesAdmin.map((notif) => (
                              <ListGroup.Item key={notif.id} className="border-0 border-bottom">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div className="flex-grow-1">
                                    <div className="d-flex align-items-center mb-2">
                                      <Badge 
                                        bg={
                                          notif.tipo === 'ALERTA' ? 'danger' :
                                          notif.tipo === 'NOTIFICACION' ? 'primary' :
                                          notif.tipo === 'PROMOCIONAL' ? 'success' : 'info'
                                        }
                                        className="me-2"
                                      >
                                        {notif.tipo}
                                      </Badge>
                                      <Badge bg="secondary" className="me-2">
                                        ID: {notif.id}
                                      </Badge>
                                      <small className="text-muted">
                                        Por: {notif.autor}
                                      </small>
                                    </div>
                                    <h6 className="mb-1">{notif.titulo}</h6>
                                    <p className="mb-1 text-muted">{notif.mensaje}</p>
                                    {notif.audiencia && notif.audiencia.length > 0 && (
                                      <div className="mt-1">
                                        <small className="text-muted">
                                          <i className="fas fa-users me-1"></i>
                                          Dirigida a: {notif.audiencia.map(a => 
                                            a.tipo_objetivo === "TODOS" ? "Todos" : 
                                            `${a.tipo_objetivo} ${a.objetivo_id || ''}`
                                          ).join(', ')}
                                        </small>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-end" style={{minWidth: '100px'}}>
                                    <small className="text-muted">
                                      <i className="fas fa-clock me-1"></i>
                                      {notif.fecha}
                                    </small>
                                  </div>
                                </div>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        )}
                      </Card.Body>
                    </Card>
                  )}
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
