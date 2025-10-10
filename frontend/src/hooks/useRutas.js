import { useState, useEffect } from "react";
import { obtenerRutas, crearRuta, actualizarRuta, eliminarRuta } from "../services/api";

const useRutas = () => {
  const [rutas, setRutas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarRutas = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await obtenerRutas();
      setRutas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error al cargar rutas.");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarRutas();
  }, []);

  const crear = async (data) => {
    setLoading(true);
    setError("");
    try {
      await crearRuta(data);
      await cargarRutas();
    } catch (err) {
      setError("Error al crear ruta.");
    }
    setLoading(false);
  };

  const editar = async (data) => {
    setLoading(true);
    setError("");
    try {
      await actualizarRuta(data);
      await cargarRutas();
    } catch (err) {
      setError("Error al editar ruta.");
    }
    setLoading(false);
  };

  const eliminar = async (id) => {
    setLoading(true);
    setError("");
    try {
      await eliminarRuta(id);
      await cargarRutas();
    } catch (err) {
      setError("Error al eliminar ruta.");
    }
    setLoading(false);
  };

  return {
    rutas,
    loading,
    error,
    cargarRutas,
    crear,
    editar,
    eliminar,
  };
};

export default useRutas;

/*
  Git quick-help (safe) - solución al error "would be overwritten by checkout"

  1) Guardar cambios en rama temporal (recomendado, conserva historial)
     git checkout -b temp/save-backend-work
     git add Backend/app.js
     git commit -m "WIP: guardar cambios en Backend/app.js"

  2) O usar stash (rápido, sin commit)
     git stash push -m "WIP Backend/app.js"
     git fetch origin
     git checkout devBackend
     # luego recuperar:
     git checkout temp/save-backend-work   # o tu rama original
     git stash pop

  3) Copiar carpeta desde devBackend -> devFrontend (sin historial)
     git fetch origin
     git checkout devFrontend
     git checkout origin/devBackend -- ruta/a/la/carpeta
     git add ruta/a/la/carpeta
     git commit -m "Importar carpeta desde origin/devBackend"
     git push origin devFrontend

  4) Alternativa con worktree (recomendado si quieres revisar antes)
     git fetch origin
     git worktree add /tmp/devBackend origin/devBackend
     cp -r /tmp/devBackend/ruta/a/la/carpeta ./ruta/a/la/carpeta
     git add ruta/a/la/carpeta
     git commit -m "Copiar carpeta desde devBackend (worktree)"
     git push origin devFrontend
     git worktree remove /tmp/devBackend

  Nota: evita 'git checkout -f' salvo que estés seguro de descartar cambios.
*/
