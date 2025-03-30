
export const dbConfig = {
    DB: process.env.DB || '',  // No se usa directamente en Railway
    USER: process.env.USER || '',  
    PASSWORD: process.env.PASSWORD || '',
    HOST: process.env.HOST || '',
    DIALECT: 'postgres',
    DATABASE_URL: process.env.DATABASE_URL  // Usa la URL de Railway
};

















