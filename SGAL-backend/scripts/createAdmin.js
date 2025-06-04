import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../src/models/user.model.js';

dotenv.config();

const createAdmin = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        // Verificar si ya existe un administrador
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Ya existe un usuario administrador:', existingAdmin.email);
            process.exit(0);
        }

        // Crear usuario administrador
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        const admin = new User({
            name: 'Administrador',
            email: 'admin@sgal.com',
            password: hashedPassword,
            role: 'admin',
            cargo: 'Administrador del Sistema',
            iniciales: 'ADM'
        });

        await admin.save();
        console.log('Usuario administrador creado exitosamente');
        console.log('Email: admin@sgal.com');
        console.log('Password: admin123');
        console.log('¡IMPORTANTE: Cambia la contraseña después del primer login!');

    } catch (error) {
        console.error('Error al crear administrador:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

createAdmin();