import { useState, useEffect } from "react";
import usuariosService from "../services/usuariosService";
import zonas from "../constants/zonas";
import roles from "../constants/roles";

export default function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  function cargarUsuarios() {
    usuariosService.getAll().then(setUsuarios);
  }

  function crearUsuario(data) {
    usuariosService.create(data).then(cargarUsuarios);
  }

  function editarUsuario(data) {
    usuariosService.update(data).then(cargarUsuarios);
  }

  function eliminarUsuario(id) {
    usuariosService.remove(id).then(cargarUsuarios);
  }

  return {
    usuarios,
    roles,
    zonas,
    cargarUsuarios,
    crearUsuario,
    editarUsuario,
    eliminarUsuario,
  };
}
