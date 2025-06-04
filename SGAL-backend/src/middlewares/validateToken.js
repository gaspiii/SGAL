import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "No se proporcionó un token" });
    }

    if (!TOKEN_SECRET) {
        console.error("TOKEN_SECRET no está definido");
        return res.status(500).json({ message: "Error de configuración del servidor" });
    }

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role; // Asignar el rol del usuario al request
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error);
        res.status(401).json({ message: "Token inválido o expirado" });
    }
};