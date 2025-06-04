import { Router } from "express";
import { 
    register, 
    login, 
    logout, 
    deleteUser, 
    getProfile, 
    getUsers, 
    updateUser 
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, loginSchema, updateUserSchema } from "../schemas/auth.schema.js";

const router = Router();

// Rutas públicas (sin autenticación)
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);

// Rutas estáticas protegidas ANTES que rutas con parámetros
router.post("/register", authRequired, verifyRole("admin"), validateSchema(registerSchema), register);
router.get("/profile", authRequired, getProfile);
router.get("/verify", authRequired, (req, res) => {
    res.json({ 
        isValid: true,
        user: {
            id: req.userId,
            role: req.userRole
        }
    });
});
router.get("/me", authRequired, (req, res) => {
    try {
        res.json({
            userId: req.userId,
            role: req.userRole,
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la información del usuario" });
    }
});
router.get("/users", authRequired, verifyRole("admin"), getUsers);

// Rutas con parámetros AL FINAL
router.put("/users/:id", authRequired, verifyRole("admin"), validateSchema(updateUserSchema), updateUser);
router.delete("/users/:id", authRequired, verifyRole("admin"), deleteUser);

export default router;