/**
 * Componente MapLeaflet
 * Compacto y expandible a pantalla completa, centrado en Retalhuleu
 */
import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapLeaflet.module.css";

const puntosAcopio = [
  // Retalhuleu y alrededores
  { id: 1, lat: 14.5367, lng: -91.6761, nombre: "Retalhuleu Centro" },
  { id: 2, lat: 14.5333, lng: -91.6833, nombre: "Acopio Norte Retalhuleu" },
  { id: 3, lat: 14.52, lng: -91.67, nombre: "Acopio Sur Retalhuleu" },
  { id: 4, lat: 14.545, lng: -91.67, nombre: "Acopio Este Retalhuleu" },
  { id: 5, lat: 14.53, lng: -91.66, nombre: "Acopio Oeste Retalhuleu" },
  { id: 6, lat: 14.54, lng: -91.68, nombre: "Acopio Central Retalhuleu" },
];

// Ruta que conecta todos los puntos en orden
const rutaTodos = puntosAcopio.map((p) => [p.lat, p.lng]);

const MAP_CENTER = [14.5367, -91.6761]; // Retalhuleu
const MAP_ZOOM = 13;

export default function MapLeaflet() {
  const [expanded, setExpanded] = useState(false);

  // Obtener color de la Polyline desde variable CSS
  const getCssVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name) ||
    undefined;
  const polylineColor = getCssVar("--color-primary-blue") || "#2563eb";

  const handleExpand = () => setExpanded(true);
  const handleClose = (e) => {
    e.stopPropagation();
    setExpanded(false);
  };

  return (
    <>
      {/* Mapa compacto */}
      {!expanded && (
        <div
          className={styles.compact}
          onClick={handleExpand}
          title="Expandir mapa"
        >
          <MapContainer
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            className={styles.map}
            scrollWheelZoom={false}
            style={{ pointerEvents: "none" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {puntosAcopio.map((punto) => (
              <Marker key={punto.id} position={[punto.lat, punto.lng]}>
                <Popup>{punto.nombre}</Popup>
              </Marker>
            ))}
            {/* Ruta que conecta todos los puntos */}
            <Polyline positions={rutaTodos} color={polylineColor} weight={5} />
          </MapContainer>
          <div className={styles.expandLabel}>Haz clic para expandir</div>
        </div>
      )}
      {/* Mapa pantalla completa */}
      {expanded && (
        <div className={styles.overlay} onClick={handleClose}>
          <div className={styles.fullMap} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={handleClose}>
              &times;
            </button>
            <MapContainer
              center={MAP_CENTER}
              zoom={MAP_ZOOM}
              className={styles.mapFull}
              scrollWheelZoom={true}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {puntosAcopio.map((punto) => (
                <Marker key={punto.id} position={[punto.lat, punto.lng]}>
                  <Popup>{punto.nombre}</Popup>
                </Marker>
              ))}
              {/* Ruta que conecta todos los puntos */}
              <Polyline
                positions={rutaTodos}
                color={polylineColor}
                weight={6}
              />
            </MapContainer>
          </div>
        </div>
      )}
    </>
  );
}
