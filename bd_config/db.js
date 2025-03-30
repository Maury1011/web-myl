import { Sequelize, DataTypes } from 'sequelize';
import { dbConfig } from './db.config.js';
import CartaModel from '../models/cartas.model.js';
import RazaModel from '../models/raza.model.js';
import TipoModel from '../models/tipo.model.js';
import RarezaModel from '../models/rareza.model.js';
import EdicionModel from '../models/edicion.model.js';

const sequelize = new Sequelize(dbConfig.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false  // Necesario en Railway
        }
    },
    logging: false
});

const db = {};

// Definir los modelos
db.Carta = CartaModel(sequelize, DataTypes);
db.Raza = RazaModel(sequelize, DataTypes);
db.Tipo = TipoModel(sequelize, DataTypes);
db.Rareza = RarezaModel(sequelize, DataTypes);
db.Edicion = EdicionModel(sequelize, DataTypes);

// Definir las relaciones
db.Carta.belongsTo(db.Raza, { foreignKey: 'raza_id' });
db.Carta.belongsTo(db.Tipo, { foreignKey: 'tipo_id' });
db.Carta.belongsTo(db.Rareza, { foreignKey: 'rareza_id' });
db.Carta.belongsTo(db.Edicion, { foreignKey: 'edicion_id' });

async function connectAndSyncDB() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida exitosamente');

        // Sincronizar la base de datos sin perder datos existentes
        await sequelize.sync({ alter: true });
        console.log('✅ Tablas sincronizadas correctamente');
    } catch (error) {
        console.error('❌ Error al conectar o sincronizar la base de datos:', error);
    }
}

connectAndSyncDB();

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;


















