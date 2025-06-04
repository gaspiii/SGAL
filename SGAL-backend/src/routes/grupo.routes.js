import { Router } from "express";
import {
    createGrupo,
    getGrupos,
    getGrupoById,
    updateGrupo,
    addMiembroToGrupo,
    removeMiembroFromGrupo,
    deleteGrupo
} from "../controllers/grupo.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { grupoSchema, updateGrupoSchema, addMiembroSchema } from "../schemas/grupo.schema.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

// Crear grupo (solo admin)
router.post("/", verifyRole("admin"), validateSchema(grupoSchema), createGrupo);

// Obtener todos los grupos
router.get("/", getGrupos);

// Rutas con parámetros específicos ANTES que rutas genéricas con parámetros
router.post("/:id/miembros", verifyRole("admin"), validateSchema(addMiembroSchema), addMiembroToGrupo);
router.delete("/:id/miembros/:userId", verifyRole("admin"), removeMiembroFromGrupo);

// Obtener grupo por ID
router.get("/:id", getGrupoById);

// Actualizar grupo (solo admin)
router.put("/:id", verifyRole("admin"), validateSchema(updateGrupoSchema), updateGrupo);

// Eliminar grupo (solo admin)
router.delete("/:id", verifyRole("admin"), deleteGrupo);

export default router;