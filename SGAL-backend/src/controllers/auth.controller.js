import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import mongoose from "mongoose";
import { setErrorMap } from "zod";


// Registro de un nuevo usuario (solo administrador)
export const register = async (req, res) => {
    const { name, email, password, role, departamento } = req.body;

    try {
        

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user", // Por defecto, los usuarios tendrán el rol "user"
            departamento,
        });

        await newUser.save();
        res.status(201).json({ message: "Usuario registrado con éxito", user: { name, email, role , departamento} });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Inicio de sesión
export const login = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        // Buscar al usuario por correo
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar la contraseña
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Generar el token JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            TOKEN_SECRET, 
            { expiresIn: "3h" }
        );

        // Enviar el token en una cookie HTTP-only
        res.cookie("token", token, { 

            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 3 * 60 * 60 * 1000 
        });
        res.json({
             message: "Inicio de sesión exitoso",
             user: {
                name: user.name,
                role: user.role,
                id: user._id,
                email: user.email,
            }
         });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};


// Cierre de sesión
export const logout = (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ message: "Cierre de sesión exitoso" });
    } catch (error) {
        console.error("Error en el cierre de sesión:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

