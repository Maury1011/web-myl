import { Sequelize, DataTypes } from 'sequelize';
import { dbConfig } from './db.config.js';
import CartaModel from '../models/cartas.model.js';  // Importa el modelo Carta
// Asegúrate de importar todos los modelos necesarios
import RazaModel from '../models/raza.model.js';  // Ajusta la ruta según corresponda
import TipoModel from '../models/tipo.model.js';  // Ajusta la ruta según corresponda
import RarezaModel from '../models/rareza.model.js';  // Ajusta la ruta según corresponda
import EdicionModel from '../models/edicion.model.js';  // Ajusta la ruta según corresponda

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.DIALECT,
    logging: false // Desactiva el registro de SQL en consola si no lo necesitas
});

const db = {};

// Definir los modelos
db.Carta = CartaModel(sequelize, DataTypes);
db.Raza = RazaModel(sequelize, DataTypes);
db.Tipo = TipoModel(sequelize, DataTypes);
db.Rareza = RarezaModel(sequelize, DataTypes);
db.Edicion = EdicionModel(sequelize, DataTypes);

// Definir las relaciones (asociaciones)
db.Carta.belongsTo(db.Raza, { foreignKey: 'raza_id' });
db.Carta.belongsTo(db.Tipo, { foreignKey: 'tipo_id' });
db.Carta.belongsTo(db.Rareza, { foreignKey: 'rareza_id' });
db.Carta.belongsTo(db.Edicion, { foreignKey: 'edicion_id' });

async function connectAndSyncDB() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos establecida exitosamente');
        
        // Sincronizar la base de datos
        await sequelize.sync({ force: false });  // Evita eliminar datos si no es necesario
        console.log('Tablas sincronizadas y datos predeterminados agregados con éxito');
    } catch (error) {
        console.error('Error al conectar o sincronizar la base de datos:', error);
    }
}

connectAndSyncDB();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;



















