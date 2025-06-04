import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Función para conectar a la base de datos
const connectDB = async () => {
    try {
        // Verificar que existe la URI de MongoDB
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI no está definida en las variables de entorno');
        }

        // Opciones de conexión para MongoDB Cloud con API estable
        const options = {
            serverSelectionTimeoutMS: 5000, // Timeout después de 5s
            socketTimeoutMS: 45000, // Cerrar sockets después de 45s
            maxPoolSize: 10, // Mantener hasta 10 conexiones
            bufferCommands: false,
            // Configuración de API estable (recomendada por MongoDB Atlas)
            serverApi: {
                version: '1',
                strict: true,
                deprecationErrors: true,
            }
        };

        // Conexión a MongoDB Cloud
        await mongoose.connect(process.env.MONGO_URI, options);
        console.log('MongoDB Cloud conectado exitosamente');
        console.log(`Base de datos: ${mongoose.connection.name}`);
        
    } catch (error) {
        console.error('Error de conexión a MongoDB:', error.message);
        
        if (error.name === 'MongoNetworkError') {
            console.error('Error de red');
        } else if (error.name === 'MongoServerSelectionError') {
            console.error('Error de autenticación.');
        }
        
        process.exit(1);
    }
};

// Eventos de conexión
mongoose.connection.on('connected', () => {
    console.log('Mongoose conectado a MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Error de conexión Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose desconectado');
});

// Cerrar conexión al terminar aplicación
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('Conexión MongoDB cerrada');
    process.exit(0);
});

export default connectDB;