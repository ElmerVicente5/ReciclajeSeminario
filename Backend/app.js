import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
const app = express();
import {router} from './src/routes/route.js';
import calendarioRouter from "./src/routes/calendario.route.js";
import acopioRouter from "./src/routes/acopio.route.js";
import {routerRankingPorZona } from "./src/routes/rankingPorZona.route.js";
import { initializeDatabase} from './src/config/db.js';
import { specs, swaggerUi } from './src/config/swagger.config.js';
import { routerAuth, users, roles } from "./src/routes/auth.route.js";
import { routerNotificaciones } from "./src/routes/notificaciones.route.js";
import { rutasRouter } from "./src/routes/rutas.route.js";
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));
app.use(express.json());
const port = process.env.PORT || 8000;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', router);
app.use("/api/calendario", calendarioRouter);
app.use("/api/acopio", acopioRouter);
app.use("/api/ranking", routerRankingPorZona);
app.use("/api/auth", routerAuth);
app.use("/api/usuarios", users);
app.use("/api/roles", roles);
app.use("/api/notificaciones", routerNotificaciones);
app.use("/api/rutas", rutasRouter);

initializeDatabase()
  .then(() => {
    app.listen(port,  () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error inicializando la base de datos:', error);
    app.listen(port,  () => {
      console.log(`Servidor corriendo (sin DB) en http://localhost:${port}`);
    });
  });