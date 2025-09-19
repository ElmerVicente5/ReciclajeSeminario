import { useState, useEffect } from "react";
import { Button, Form, ListGroup, Card, Badge, OverlayTrigger, Popover } from "react-bootstrap";
import styles from "./Notificaciones.module.css";
import DashboardSidebar from "../Dashboard/DashboardSidebar";

// Simulación de usuario actual (puedes cambiar esto por tu lógica real)
const usuarioActual = {
  rol: "admin", // Cambia a "user" para probar el modo solo lectura
  nombre: "Administrador",
};

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([
    {
      id: 1,
      mensaje: "Bienvenido al sistema!",
      fecha: new Date().toLocaleString(),
      autor: "Sistema",
    },
  ]);
  const [mensaje, setMensaje] = useState("");
  const [toastBubble, setToastBubble] = useState({ show: false, mensaje: "", autor: "", fecha: "", id: null });

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

  const handleCrear = () => {
    if (mensaje.trim() === "") return;
    const nueva = {
      id: Date.now(),
      mensaje,
      fecha: new Date().toLocaleString(),
      autor: usuarioActual.nombre,
    };
    setNotificaciones([nueva, ...notificaciones]);
    setMensaje("");
    // Enviar a otras pestañas
    localStorage.setItem("nuevaNotificacion", JSON.stringify(nueva));
    setTimeout(() => localStorage.removeItem("nuevaNotificacion"), 500);
  };

  // Burbuja tipo Facebook para nueva notificación
  const popover = (
    <Popover id="popover-notificacion" style={{ minWidth: 260 }}>
      <Popover.Header as="h3">Nueva Notificación</Popover.Header>
      <Popover.Body>
        <Badge bg="secondary" className="me-2">{toastBubble.autor}</Badge>
        <div className="mb-2">{toastBubble.mensaje}</div>
        <div className="text-end text-muted" style={{ fontSize: "0.9rem" }}>{toastBubble.fecha}</div>
        <Button
          size="sm"
          variant="primary"
          className="mt-2 w-100"
          onClick={() => setToastBubble({ ...toastBubble, show: false })}
        >
          Ver mensaje
        </Button>
      </Popover.Body>
    </Popover>
  );

  // Agrega este botón solo para pruebas locales, simula recibir una notificación desde otra pestaña
  function simularNotificacion() {
    const simulada = {
      id: Date.now(),
      mensaje: "¡Notificación simulada desde otra pestaña!",
      fecha: new Date().toLocaleString(),
      autor: "Simulador",
    };
    localStorage.setItem("nuevaNotificacion", JSON.stringify(simulada));
    setTimeout(() => localStorage.removeItem("nuevaNotificacion"), 500);
  }

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
              {/* Botón para simular notificación en local */}
              <div className="mb-3">
                <Button variant="outline-info" size="sm" onClick={simularNotificacion}>
                  Simular notificación (prueba local)
                </Button>
              </div>
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
                    <Badge
                      bg="primary"
                      style={{ fontSize: "1rem", padding: "8px 16px" }}
                    >
                      {usuarioActual.rol === "admin" ? "Admin" : "Usuario"}
                    </Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  {usuarioActual.rol === "admin" ? (
                    <Form className={styles.nuevaForm}>
                      <Form.Control
                        type="text"
                        placeholder="Escribe una notificación..."
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        maxLength={120}
                      />
                      <Button variant="primary" onClick={handleCrear}>
                        Enviar
                      </Button>
                    </Form>
                  ) : (
                    <div className="alert alert-info mb-3">
                      Solo los administradores pueden enviar notificaciones.
                    </div>
                  )}
                  <div className={styles.listadoTitulo}>
                    Historial de Notificaciones
                  </div>
                  <ListGroup>
                    {notificaciones.length === 0 ? (
                      <ListGroup.Item>No hay notificaciones.</ListGroup.Item>
                    ) : (
                      notificaciones.map((n) => (
                        <ListGroup.Item
                          key={n.id}
                          className={styles.notificacionItem}
                        >
                          <div>
                            <span className={styles.notificacionAutor}>
                              <Badge
                                bg="secondary"
                                style={{ marginRight: 8 }}
                              >
                                {n.autor}
                              </Badge>
                            </span>
                            <span>{n.mensaje}</span>
                          </div>
                          <span className={styles.notificacionFecha}>
                            {n.fecha}
                          </span>
                        </ListGroup.Item>
                      ))
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
