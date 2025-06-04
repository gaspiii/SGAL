import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const authRequired = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "No se proporcionó un token" });
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