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

export default function MapLeaflet({ puntos }) {
  const [expanded, setExpanded] = useState(false);

  // Si no hay puntos, usar centro y zoom por defecto
  const MAP_CENTER =
    puntos && puntos.length > 0
      ? [
          puntos[0].latitud || puntos[0].lat,
          puntos[0].longitud || puntos[0].lng,
        ]
      : [14.5367, -91.6761];
  const MAP_ZOOM = 13;

  // Obtener color de la Polyline desde variable CSS
  const getCssVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name) ||
    undefined;
  const polylineColor = getCssVar("--color-primary-blue") || "#2563eb";

  // Ruta que conecta todos los puntos
  const rutaTodos = puntos
    ? puntos.map((p) => [p.latitud || p.lat, p.longitud || p.lng])
    : [];

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
            {puntos &&
              puntos.map((punto) => (
                <Marker
                  key={punto.id}
                  position={[
                    punto.latitud || punto.lat,
                    punto.longitud || punto.lng,
                  ]}
                >
                  <Popup>
                    <b>{punto.nombre}</b>
                    <br />
                    <span>Tipo: {punto.tipo}</span>
                    <br />
                    <span>Zona: {punto.zona_id}</span>
                    <br />
                    <span>Horario: {punto.horario}</span>
                    <br />
                    <span>Dirección: {punto.direccion}</span>
                  </Popup>
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
              {puntos &&
                puntos.map((punto) => (
                  <Marker
                    key={punto.id}
                    position={[
                      punto.latitud || punto.lat,
                      punto.longitud || punto.lng,
                    ]}
                  >
                    <Popup>
                      <b>{punto.nombre}</b>
                      <br />
                      <span>Tipo: {punto.tipo}</span>
                      <br />
                      <span>Zona: {punto.zona_id}</span>
                      <br />
                      <span>Horario: {punto.horario}</span>
                      <br />
                      <span>Dirección: {punto.direccion}</span>
                    </Popup>
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
