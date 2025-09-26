// Recibe calendarioHook
export default function CalendarioFilters({ calendarioHook }) {
  const {
    zona,
    setZona,
    diasUnicos = [],
    frecuencias = [],
    setFiltroDia,
    setFiltroFrecuencia,
  } = calendarioHook;

  return (
    <div className="mb-3 d-flex gap-2 flex-wrap">
      <select className="form-select" value={zona} onChange={e => setZona(e.target.value)}>
        <option value="">Zona</option>
        <option value="Todas">Todas</option>
        <option value="Norte">Norte</option>
        <option value="Sur">Sur</option>
        {/* Puedes agregar más zonas dinámicamente si lo deseas */}
      </select>
      <select className="form-select" onChange={e => setFiltroDia(e.target.value)}>
        <option value="">Día</option>
        {(Array.isArray(diasUnicos) ? diasUnicos : []).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select className="form-select" onChange={e => setFiltroFrecuencia(e.target.value)}>
        <option value="">Frecuencia</option>
        {(Array.isArray(frecuencias) ? frecuencias : []).map((f) => (
          <option key={f} value={f}>{f}</option>
        ))}
      </select>
    </div>
  );
}
