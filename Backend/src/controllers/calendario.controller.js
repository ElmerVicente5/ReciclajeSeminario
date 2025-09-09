import express from "express";
import { body, param, query, validationResult } from "express-validator";
import { obtenerCalendario } from "../services/calendario.service.js"; 


// Middleware de validación
const calendarioValidation= [
  query("zona")
    .notEmpty()
    .withMessage("El parámetro 'zona' es obligatorio")
    .isString()
    .withMessage("La zona debe ser texto válido"),

  query("fecha")
   .notEmpty()
   .withMessage("El parámetro 'fecha' es obligatorio")
   .matches(/^\d{4}-\d{2}-\d{2}$/)
   .withMessage("La fecha debe estar en formato válido YYYY-MM-DD"),
];


export const getCalendario = [
  ...calendarioValidation, // validaciones
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
     
      const { zona, fecha } = req.query;

      const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
      const diaSemana = dias[new Date(fecha).getDay()];

      const data = await obtenerCalendario(zona, diaSemana);

      res.json({
        message: "Calendario obtenido exitosamente",
        data,
      });

    } catch (error) {
      console.error("Error al obtener el calendario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
];