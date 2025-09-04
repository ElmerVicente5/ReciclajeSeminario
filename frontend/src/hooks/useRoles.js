import { useState, useEffect } from "react";
import usuariosService from "../services/usuariosService";

export default function useRoles() {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    usuariosService.getRoles().then(setRoles);
  }, []);

  function crearRol(data) {
    usuariosService
      .createRol(data)
      .then(() => usuariosService.getRoles().then(setRoles));
  }

  function editarRol(data) {
    usuariosService
      .updateRol(data)
      .then(() => usuariosService.getRoles().then(setRoles));
  }

  function eliminarRol(id) {
    usuariosService
      .removeRol(id)
      .then(() => usuariosService.getRoles().then(setRoles));
  }

  return {
    roles,
    crearRol,
    editarRol,
    eliminarRol,
  };
}
