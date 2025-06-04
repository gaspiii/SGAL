import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Verificar que las variables críticas estén presentes
if (!process.env.TOKEN_SECRET) {
    console.error('ERROR: TOKEN_SECRET no está definido en el archivo .env');
    console.error('Agrega esta línea a tu archivo .env:');
    console.error('TOKEN_SECRET=tu_clave_secreta_muy_segura');
    process.exit(1);
}

if (!process.env.MONGO_URI) {
    console.error('ERROR: MONGO_URI no está definido en el archivo .env');
    console.error('Agrega esta línea a tu archivo .env:');
    console.error('MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/sgal_db');
    process.exit(1);
}

console.log('Variables de entorno cargadas correctamente');
console.log('TOKEN_SECRET:', process.env.TOKEN_SECRET ? 'DEFINIDO' : 'NO DEFINIDO');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'DEFINIDO' : 'NO DEFINIDO');

export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';