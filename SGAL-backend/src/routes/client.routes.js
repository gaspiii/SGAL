import { Router } from "express";
import {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
} from "../controllers/client.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { clientSchema, updateClientSchema } from "../schemas/client.schema.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

// Crear cliente (solo admin)
router.post("/", verifyRole("admin"), validateSchema(clientSchema), createClient);

// Obtener todos los clientes
router.get("/", getClients);

// Obtener cliente por ID
router.get("/:id", getClientById);

// Actualizar cliente (solo admin)
router.put("/:id", verifyRole("admin"), validateSchema(updateClientSchema), updateClient);

// Eliminar cliente (solo admin)
router.delete("/:id", verifyRole("admin"), deleteClient);

export default router;