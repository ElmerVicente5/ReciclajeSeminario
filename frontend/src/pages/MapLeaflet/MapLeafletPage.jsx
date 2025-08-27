// Página de mapa interactivo para puntos de acopio
import MapLeaflet from "../../components/MapLeaflet/MapLeaflet";
import styles from "./MapLeafletPage.module.css";

export default function MapLeafletPage() {
  // Datos de ejemplo para filtros y listados
  const resumen = [
    { label: "Activos", value: 24, className: styles.resumenActivo },
    { label: "Saturados", value: 3, className: styles.resumenSaturado },
    { label: "Fuera de servicio", value: 1, className: styles.resumenFuera },
  ];
  const puntos = [
    {
      nombre: "Punto Centro Retalhuleu",
      estado: "Activo",
      estadoClass: styles.activo,
      direccion: "Av.Zona2",
      tipos: [
        { label: "Reciclable", className: styles.reciclable },
        { label: "Organico", className: styles.organico },
      ],
    },
    {
      nombre: "Punto Colonia España",
      estado: "Saturado",
      estadoClass: styles.saturado,
      direccion: "Av.Zona2",
      tipos: [
        { label: "Reciclable", className: styles.reciclable },
        { label: "No reciclable", className: styles.noreciclable },
      ],
    },
    {
      nombre: "Punto Colonia San Antonio",
      estado: "Fuera de servicio",
      estadoClass: styles.fuera,
      direccion: "Av.Zona2",
      tipos: [{ label: "Organico", className: styles.organico }],
    },
  ];

  return (
    <div className={styles.pageBg}>
      <div className={styles.container}>
        <div>
          <h1 className={styles.titulo}>Puntos de Acopio</h1>
          <div className={styles.filtros}>
            <div className={styles.filtro}>
              Zona
              <br />
              Todas
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
          <div className={styles.resumen}>
            {resumen.map((r) => (
              <div key={r.label} className={styles.resumenItem}>
                {r.label}
                <span className={r.className}>{r.value}</span>
              </div>
            ))}
          </div>
          <div className={styles.listados}>
            <div className={styles.listadoTitulo}>Listados de Puntos</div>
            {puntos.map((p) => (
              <div key={p.nombre} className={styles.punto}>
                <span style={{ fontWeight: "bold" }}>{p.nombre}</span>
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
                  {p.direccion}
                </div>
                {p.tipos.map((t) => (
                  <span
                    key={t.label}
                    className={t.className + " " + styles.tipo}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div>
          <MapLeaflet />
        </div>
      </div>
    </div>
  );
}
