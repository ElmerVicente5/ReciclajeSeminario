import { useState } from "react";
import { fetchApi } from "../services/api";

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener todos los usuarios
  const cargarUsuarios = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi("/api/usuarios/obtenerUsuarios");
      setUsuarios(data || []);
    } catch (err) {
      setError("Error al cargar usuarios.");
    }
    setLoading(false);
  };

  // Obtener usuario por ID
  const getById = async (id) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi(`/api/usuarios/obtenerUsuarioId/${id}`);
      setLoading(false);
      return data;
    } catch (err) {
      setError("Error al obtener usuario.");
      setLoading(false);
      return null;
    }
  };

  // Crear usuario (puedes adaptar el endpoint si lo tienes)
  const crearUsuario = async (data) => {
    setLoading(true);
    setError("");
    try {
      await fetchApi("/api/usuarios/crearUsuario", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await cargarUsuarios();
    } catch (err) {
      setError("Error al crear usuario.");
    }
    setLoading(false);
  };

  // Editar usuario
  const editarUsuario = async (data) => {
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/api/usuarios/actualizarUsuario/${data.id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      await cargarUsuarios();
    } catch (err) {
      setError("Error al editar usuario.");
    }
    setLoading(false);
  };

  // Eliminar usuario
  const eliminarUsuario = async (id) => {
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/api/usuarios/eliminarUsuario/${id}`, {
        method: "DELETE",
      });
      await cargarUsuarios();
    } catch (err) {
      setError("Error al eliminar usuario.");
    }
    setLoading(false);
  };

  return {
    usuarios,
    loading,
    error,
    cargarUsuarios,
    getById,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
  };
};

export default useUsuarios;