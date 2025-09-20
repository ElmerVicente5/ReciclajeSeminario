import { useState } from "react";
import { fetchApi } from "../services/api";

const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Obtener listado de roles
  const cargarRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi("/api/roles/obtenerListadoRoles");
      setRoles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar roles.");
    }
    setLoading(false);
  };

  // Crear rol (POST /api/roles/crearRol)
  const crearRol = async (data) => {
    setLoading(true);
    setError("");
    try {
      // Solo enviar { nombre }
      await fetchApi("/api/roles/crearRol", {
        method: "POST",
        body: JSON.stringify({ nombre: data.nombre }),
      });
      await cargarRoles();
    } catch (err) {
      setError("Error al crear rol.");
    }
    setLoading(false);
  };

  // Editar rol (PUT /api/roles/actualizarRolId/{id})
  const editarRol = async (data) => {
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/api/roles/actualizarRolId/${data.id}`, {
        method: "PUT",
        body: JSON.stringify({ nombre: data.nombre }),
      });
      await cargarRoles();
    } catch (err) {
      setError("Error al editar rol.");
    }
    setLoading(false);
  };

  // Eliminar rol (DELETE /api/roles/eliminarRolId/{id})
  const eliminarRol = async (id) => {
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/api/roles/eliminarRolId/${id}`, {
        method: "DELETE",
      });
      await cargarRoles();
    } catch (err) {
      setError("Error al eliminar rol.");
    }
    setLoading(false);
  };

  return {
    roles,
    loading,
    error,
    cargarRoles,
    crearRol,
    editarRol,
    eliminarRol,
  };
};

export default useRoles;