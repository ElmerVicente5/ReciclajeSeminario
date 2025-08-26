import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MapLeaflet.module.css";

const puntosAcopio = [
  { id: 1, lat: 19.4326, lng: -99.1332, nombre: "Centro CDMX" },
  { id: 2, lat: 19.427, lng: -99.145, nombre: "Acopio Norte" },
  { id: 3, lat: 19.44, lng: -99.14, nombre: "Acopio Sur" },
  // Ubicaciones de Guatemala
  { id: 4, lat: 14.6349, lng: -90.5069, nombre: "Centro Guatemala" },
  { id: 5, lat: 14.6048, lng: -90.4891, nombre: "Zona 1 Guatemala" },
  { id: 6, lat: 14.6131, lng: -90.535, nombre: "Mixco Guatemala" },
];

export default function MapLeaflet() {
  return (
    <MapContainer
      center={[19.4326, -99.1332]}
      zoom={13}
      className={styles.map}
      scrollWheelZoom={false}
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
    </MapContainer>
  );
}
