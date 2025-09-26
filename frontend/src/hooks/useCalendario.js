import { useState } from "react";
import { getCalendario, crearHorarioCalendario, obtenerCalendarioCompleto, actualizarHorarioCalendario, eliminarHorarioCalendario } from "../services/api";

export function useCalendario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [calendario, setCalendario] = useState([]);
  const [form, setForm] = useState({
    ruta_id: "",
    dia_semana: "",
    hora_inicio: "",
    hora_fin: "",
    frecuencia: "",
    notas: "",
    id: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [zona, setZona] = useState("");
  const [diasUnicos, setDiasUnicos] = useState([]);
  const [frecuencias, setFrecuencias] = useState([]);
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroFrecuencia, setFiltroFrecuencia] = useState("");

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  // Carga todos los datos y extrae filtros únicos
  const refreshCalendario = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await obtenerCalendarioCompleto();
      const data = Array.isArray(res?.data) ? res.data : [];
      setCalendario(data);

      // Extrae días y frecuencias únicos
      setDiasUnicos(Array.from(new Set(data.map(c => diasSemana[c.dia_semana])).values()));
      setFrecuencias(Array.from(new Set(data.map(c => c.frecuencia)).values()));
      setLoading(false);
    } catch (err) {
      setError("Error al obtener calendario completo");
      setCalendario([]);
      setLoading(false);
    }
  };

  const getCalendarioHook = async (zona, fecha) => {
    setLoading(true);
    setError("");
    try {
      const res = await getCalendario(zona, fecha);
      setLoading(false);
      return res;
    } catch (err) {
      setError("Error al obtener calendario");
      setLoading(false);
      return [];
    }
  };

  const crearHorario = async (data) => {
    setLoading(true);
    setError("");
    try {
      await crearHorarioCalendario(data);
      setLoading(false);
      return true;
    } catch (err) {
      setError("Error al crear horario");
      setLoading(false);
      return false;
    }
  };

  const getCalendarioCompleto = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await obtenerCalendarioCompleto();
      setLoading(false);
      return res;
    } catch (err) {
      setError("Error al obtener calendario completo");
      setLoading(false);
      return [];
    }
  };

  const actualizarHorario = async (id, data) => {
    setLoading(true);
    setError("");
    try {
      // Solo envía los campos permitidos por el backend
      const payload = {
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        frecuencia: data.frecuencia,
        notas: data.notas,
      };
      await actualizarHorarioCalendario(id, payload);
      setLoading(false);
      return true;
    } catch (err) {
      setError("Error al actualizar horario");
      setLoading(false);
      return false;
    }
  };

  const eliminarHorario = async (id) => {
    setLoading(true);
    setError("");
    try {
      await eliminarHorarioCalendario(id);
      setLoading(false);
      return true;
    } catch (err) {
      setError("Error al eliminar horario");
      setLoading(false);
      return false;
    }
  };

  // Editar y eliminar desde la tabla
  const handleEdit = (horario) => {
    setForm({
      ruta_id: horario.ruta_id,
      dia_semana: horario.dia_semana,
      hora_inicio: typeof horario.hora_inicio === "string"
        ? horario.hora_inicio.slice(0, 5)
        : horario.hora_inicio, // Asegura formato HH:mm
      hora_fin: typeof horario.hora_fin === "string"
        ? horario.hora_fin.slice(0, 5)
        : horario.hora_fin,
      frecuencia: horario.frecuencia,
      notas: horario.notas,
      id: horario.id,
    });
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    await eliminarHorario(id);
    await refreshCalendario();
  };

  // Filtrado local
  const getFiltrado = () => {
    let filtrados = calendario;
    if (zona) {
      filtrados = filtrados.filter(c =>
        zona === "Todas" || (c.rutas?.zonas?.nombre?.toLowerCase() === zona.toLowerCase())
      );
    }
    if (filtroDia) {
      const idx = diasSemana.indexOf(filtroDia);
      filtrados = filtrados.filter(c => c.dia_semana === idx);
    }
    if (filtroFrecuencia) {
      filtrados = filtrados.filter(c => c.frecuencia === filtroFrecuencia);
    }
    return filtrados;
  };

  return {
    calendario: getFiltrado(),
    form,
    setForm,
    editMode,
    setEditMode,
    handleEdit,
    handleDelete,
    crearHorario,
    actualizarHorario,
    eliminarHorario,
    refreshCalendario,
    loading,
    error,
    zona,
    setZona,
    diasUnicos,
    frecuencias,
    filtroDia,
    setFiltroDia,
    filtroFrecuencia,
    setFiltroFrecuencia,
    diasSemana,
  };
}