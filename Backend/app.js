import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
const app = express();
import {router} from './src/routes/route.js';
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-api-key']
}));

app.use('/api', router);
 
app.use(express.json());
const port = process.env.PORT || 8000;
app.listen(port,  () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});