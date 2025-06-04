import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Importar rutas
import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import cotizacionRoutes from './routes/cotizacion.routes.js';
import grupoRoutes from './routes/grupo.routes.js';

const app = express();

// Configuración CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));

// Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString()
    });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/cotizaciones', cotizacionRoutes);
app.use('/api/grupos', grupoRoutes);

// Ruta 404
app.use('*', (req, res) => {
    res.status(404).json({ 
        message: 'Ruta no encontrada',
        path: req.originalUrl 
    });
});

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error no manejado:', err);
    res.status(500).json({ 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

export default app;