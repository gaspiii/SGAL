import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.routes.js';


const app = express();
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders:['set-cookie']
    }
));
app.use(morgan('dev'));
app.use(express.json()); // Manejar JSON en solicitudes
app.use(cookieParser()); // Middleware para manejar cookies
app.use('/api', authRoutes);

export default app;