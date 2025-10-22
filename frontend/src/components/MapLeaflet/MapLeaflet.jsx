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
  // Si hay puntos, centrar en el promedio de sus coordenadas
  let MAP_CENTER = [14.5367, -91.6761];
  if (puntos && puntos.length > 0) {
    const latitudes = puntos.map(p => Number(p.latitud || p.lat));
    const longitudes = puntos.map(p => Number(p.longitud || p.lng));
    const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
    MAP_CENTER = [avgLat, avgLng];
  }
  // Zoom ideal para ver solo el departamento
  const MAP_ZOOM = 11;
  // No permitir expansión
  const expanded = false;

  // Obtener color de la Polyline desde variable CSS
  const getCssVar = (name) =>
    getComputedStyle(document.documentElement).getPropertyValue(name) ||
    undefined;
  const polylineColor = getCssVar("--color-primary-blue") || "#2563eb";

  // Ruta que conecta todos los puntos
  const rutaTodos = puntos
    ? puntos.map((p) => [p.latitud || p.lat, p.longitud || p.lng])
    : [];



  return (
    <div className={styles.compact}>
      <MapContainer
        center={MAP_CENTER}
        zoom={MAP_ZOOM}
        className={styles.map}
        scrollWheelZoom={false}
        style={{ pointerEvents: "auto" }}
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
    </div>
  );
}
