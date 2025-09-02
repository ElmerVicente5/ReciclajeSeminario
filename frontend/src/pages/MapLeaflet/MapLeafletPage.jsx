// Página de mapa interactivo para puntos de acopio

import { useState } from "react";
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
import styles from "./MapLeafletPage.module.css";

export default function MapLeafletPage() {
  // Datos de ejemplo para filtros y listados
  const resumen = [
    { label: "Activos", value: 24, className: styles.resumenActivo },
    { label: "Saturados", value: 3, className: styles.resumenSaturado },
    { label: "Fuera de servicio", value: 1, className: styles.resumenFuera },
  ];
  // Simulación de zonas
  const zonas = [
    { id: 1, nombre: "Zona Centro" },
    { id: 2, nombre: "Zona Norte" },
    { id: 3, nombre: "Zona Sur" },
  ];
  const puntos = [
    {
      id: 1,
      tipo: "Reciclable",
      nombre: "Punto Centro Retalhuleu",
      latitud: 14.535,
      longitud: -91.677,
      direccion: "Av.Zona2",
      zona_id: 2,
      horario: "08:00-18:00",
      estado: "Activo",
      estadoClass: styles.activo,
    },
    {
      id: 2,
      tipo: "Reciclable",
      nombre: "Punto Colonia España",
      latitud: 14.54,
      longitud: -91.67,
      direccion: "Av.Zona2",
      zona_id: 3,
      horario: "09:00-17:00",
      estado: "Saturado",
      estadoClass: styles.saturado,
    },
    {
      id: 3,
      tipo: "Organico",
      nombre: "Punto Colonia San Antonio",
      latitud: 14.538,
      longitud: -91.672,
      direccion: "Av.Zona2",
      zona_id: 1,
      horario: "07:00-15:00",
      estado: "Fuera de servicio",
      estadoClass: styles.fuera,
    },
  ];

  // Estado para filtro de zona
  const [zonaFiltro, setZonaFiltro] = useState(0); // 0 = todas
  const puntosFiltrados =
    zonaFiltro === 0 ? puntos : puntos.filter((p) => p.zona_id === zonaFiltro);

  return (
    <div className={styles.pageBg}>
      <div className={`container-fluid px-2 px-md-4 py-3 ${styles.container}`}>
        {/* container-fluid para ancho completo */}
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <h1 className={styles.titulo}>Puntos de Acopio</h1>
            <div className="d-flex flex-row flex-wrap gap-3 mb-3 align-items-stretch">
              <div
                className={`d-flex flex-row flex-wrap gap-2 ${styles.filtros}`}
                style={{ flex: 2, minWidth: 0 }}
              >
                <div className={styles.filtro}>
                  Zona
                  <br />
                  <select
                    className="form-select form-select-sm mt-1"
                    value={zonaFiltro}
                    onChange={(e) => setZonaFiltro(Number(e.target.value))}
                  >
                    <option value={0}>Todas</option>
                    {zonas.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.filtro}>
                  Residuo
                  <br />
                  Todos
                </div>
                <div className={styles.filtro}>
                  Estado
                  <br />
                  Todos
                </div>
                <div className={styles.filtro}>
                  Buscar
                  <br />
                  Dirección
                </div>
              </div>
              <div
                className={`d-flex flex-row gap-2 ${styles.resumen}`}
                style={{ flex: 1, minWidth: 0 }}
              >
                {resumen.map((r) => (
                  <div key={r.label} className={styles.resumenItem}>
                    {r.label}
                    <span className={r.className}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${styles.listados} w-100`}>
              <div className={styles.listadoTitulo}>Listados de Puntos</div>
              <div className="d-flex flex-column gap-3">
                {puntosFiltrados.map((p) => {
                  const zona =
                    zonas.find((z) => z.id === p.zona_id)?.nombre || p.zona_id;
                  return (
                    <div
                      key={p.id}
                      className={`${styles.punto} d-flex flex-wrap align-items-center gap-2 gap-md-3 w-100`}
                    >
                      <span className="fw-bold flex-grow-1 min-w-0">
                        {p.nombre}
                      </span>
                      <span className={p.estadoClass} style={{ marginLeft: 8 }}>
                        {p.estado}
                      </span>
                      <div
                        style={{
                          color: "#222e3a",
                          fontSize: "0.98rem",
                          marginBottom: 4,
                        }}
                      >
                        <b>Tipo:</b> {p.tipo} | <b>Zona:</b> {zona} |{" "}
                        <b>Horario:</b> {p.horario}
                      </div>
                      <div
                        style={{
                          color: "#222e3a",
                          fontSize: "0.98rem",
                          marginBottom: 4,
                        }}
                      >
                        <b>Dirección:</b> {p.direccion}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <MapLeaflet puntos={puntosFiltrados} />
          </div>
        </div>
      </div>
    </div>
  );
}
