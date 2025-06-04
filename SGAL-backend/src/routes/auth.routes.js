import { Router } from "express";
import { register, login, logout, deleteUser } from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

// Registro de un usuario (solo administrador)
router.post("/register", authRequired, verifyRole("admin"),validateSchema(registerSchema), register);

// Inicio de sesión
router.post("/login",validateSchema(loginSchema) ,login);

router.get("/me", authRequired, (req, res) => {
    try {
        // La información del usuario ya está en `req.userId` y `req.userRole`
        res.json({
            userId: req.userId,
            role: req.userRole,
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la información del usuario" });
    }
});

router.get("/verify", authRequired, (req, res) => {
    res.json({ isValid: true });
});

// Cierre de sesión
router.post("/logout", logout);

// Eliminar un usuario (solo administrador)
router.delete("/deleteUser/:id", authRequired, verifyRole("admin"), deleteUser);



export default router;