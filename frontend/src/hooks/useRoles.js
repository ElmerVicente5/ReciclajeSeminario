import { useState, useEffect } from "react";
import { fetchApi } from "../services/api";

const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarRoles = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchApi("/api/roles/obtenerListadoRoles");
      setRoles(data || []);
    } catch (err) {
      setError("Error al cargar roles.");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const crearRol = async (rol) => {
    setLoading(true);
    setError("");
    try {
      await fetchApi("/api/roles/crearRoles", {
        method: "POST",
        body: JSON.stringify(rol),
      });
      await cargarRoles();
    } catch (err) {
      setError("Error al crear rol.");
    }
    setLoading(false);
  };

  const editarRol = async (rol) => {
    setLoading(true);
    setError("");
    try {
      await fetchApi(`/api/roles/actualizarRolId/${rol.id}`, {
        method: "PUT",
        body: JSON.stringify(rol),
      });
      await cargarRoles();
    } catch (err) {
      setError("Error al editar rol.");
    }
    setLoading(false);
  };

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

  return { roles, cargarRoles, crearRol, editarRol, eliminarRol, loading, error };
};

export default useRoles;