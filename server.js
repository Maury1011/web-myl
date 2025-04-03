import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { mostrarCartas } from './controllers/cartas.controller.js';

const app = express();
const port = 3000;

// Configura el directorio público para archivos estáticos
app.use(express.static('public'));
app.use('/imagenes', express.static('imagenes'));

// Configura EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', './views');

// Ruta para obtener todas las cartas y renderizar la vista
app.get('/', mostrarCartas);


// Función para iniciar el servidor después de la conexión a la base de datos
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
