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
app.get('/', async (req, res) => {
    try {
        const { edicion, tipo, raza, subRaza, rareza } = req.query;

        const whereClause = {};

        if (edicion) whereClause['edicion_id'] = edicion;
        if (tipo) whereClause['tipo_id'] = tipo;
        if (raza) whereClause['raza_id'] = raza;
        if (rareza) whereClause['rareza_id'] = rareza;

        // Configurar filtros para subRaza (si se selecciona una)
        const includeSubRaza = {
            model: db.SubRaza,
            attributes: ['id', 'nombre'],
            through: { attributes: [] }
        };

        if (subRaza) {
            includeSubRaza.where = { id: subRaza }; // Filtrar cartas que tengan esta subRaza
        }

        // Consulta con los filtros aplicados
        const cartas = await db.Carta.findAll({
            where: whereClause,
            include: [
                { model: db.Edicion, attributes: ['id', 'nombre'] },
                { model: db.Tipo, attributes: ['id', 'nombre'] },
                { model: db.Raza, attributes: ['id', 'nombre'] },
                includeSubRaza, // Se filtra solo si `subRaza` fue pasado como query param
                { model: db.Rareza, attributes: ['id', 'nombre'] }
            ],
            order: [['id', 'ASC']], // Ordenar por ID ascendente
            limit: 400
        });

        // Obtener todas las ediciones, tipos, razas, sub razas y rarezas para los filtros
        const ediciones = await db.Edicion.findAll();
        const tipos = await db.Tipo.findAll();
        const razas = await db.Raza.findAll();
        const subRazas = await db.SubRaza.findAll();
        const rarezas = await db.Rareza.findAll();

        // Pasar los datos a la vista
        res.render('cartas', { 
            cartas, 
            ediciones, 
            tipos, 
            razas,
            subRazas, 
            rarezas,
            selectedEdicion: edicion || '',
            selectedTipo: tipo || '',
            selectedRaza: raza || '',
            selectedSubRaza: subRaza ? [subRaza] : [],
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
