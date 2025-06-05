import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// Registro de un nuevo usuario (solo administrador)
export const register = async (req, res) => {
    const { name, email, password, role, cargo, iniciales, username } = req.body;

    try {
        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "El correo electrónico ya está registrado" });
        }

        // Verificar username si se proporciona
        if (username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
            }
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            cargo,
            iniciales,
            username: username || null,
        });

        await newUser.save();
        res.status(201).json({ 
            message: "Usuario registrado con éxito", 
            user: { 
                id: newUser._id,
                name, 
                email, 
                role, 
                cargo,
                iniciales,
                username 
            } 
        });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
};

// Inicio de sesión
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Buscar al usuario por correo y popular los grupos
        const user = await User.findOne({ email }).populate('grupos');
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
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                cargo: user.cargo,
                iniciales: user.iniciales,
                username: user.username,
                grupos: user.grupos
            }
        });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener información del usuario autenticado
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password').populate('grupos');
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                cargo: user.cargo,
                iniciales: user.iniciales,
                username: user.username,
                grupos: user.grupos,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
        });
    } catch (error) {
        console.error("Error al obtener el perfil:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Obtener todos los usuarios (solo admin)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').populate('grupos');
        res.json(users);
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role, cargo, iniciales, username, grupos } = req.body;

        // Verificar si el usuario existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Verificar email único (si se está cambiando)
        if (email && email !== user.email) {
            const existingEmail = await User.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ message: "El correo electrónico ya está en uso" });
            }
        }

        // Verificar username único (si se está cambiando)
        if (username && username !== user.username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, role, cargo, iniciales, username, grupos },
            { new: true, runValidators: true }
        ).select('-password').populate('grupos');

        res.json({ 
            message: "Usuario actualizado correctamente", 
            user: updatedUser 
        });
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);
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

// Eliminar usuario
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