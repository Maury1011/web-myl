import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import db from './bd_config/db.js';
const { Carta } = db;

const app = express();
const port = 3000;

// Configura el directorio público para archivos estáticos
app.use(express.static('public'));
app.use('/imageneswebp', express.static('imagenes webp'));
app.use('/imagenes', express.static('imagenes'));

// Configura EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', './views');

// Ruta para obtener todas las cartas y renderizar la vista
app.get('/cartas', async (req, res) => {
    try {
        const { edicion, tipo, raza, coste, rareza } = req.query;

        const whereClause = {};

        if (edicion) whereClause['edicion_id'] = edicion;
        if (tipo) whereClause['tipo_id'] = tipo;
        if (raza) whereClause['raza_id'] = raza;
        if (rareza) whereClause['rareza_id'] = rareza;
        

        // Consulta con los filtros aplicados
        const cartas = await db.Carta.findAll({
            where: whereClause,
            include: [
                { model: db.Edicion, attributes: ['id', 'nombre'] },
                { model: db.Tipo, attributes: ['id', 'nombre'] },
                { model: db.Raza, attributes: ['id', 'nombre'] },
                { model: db.Rareza, attributes: ['id', 'nombre'] },
            ],
            limit: 100
        });

        // Obtener todas las ediciones, tipos, razas y rarezas para los filtros
        const ediciones = await db.Edicion.findAll();
        const tipos = await db.Tipo.findAll();
        const razas = await db.Raza.findAll();
        const rarezas = await db.Rareza.findAll();

        // Pasar los datos a la vista
        res.render('cartas', { 
            cartas, 
            ediciones, 
            tipos, 
            razas, 
            rarezas,
            selectedEdicion: edicion || '',
            selectedTipo: tipo || '',
            selectedRaza: raza || '',
            selectedRareza: rareza || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las cartas');
    }
});

// Función para iniciar el servidor después de la conexión a la base de datos
app.listen(port, () => {
    console.log(`Servidor iniciado en http://localhost:${port}`);
});
