import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
const app = express();
import {router} from './src/routes/route.js';
import calendarioRouter from "./src/routes/calendario.route.js";
import { initializeDatabase} from './src/config/db.js';
import { specs, swaggerUi } from './src/config/swagger.config.js';
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