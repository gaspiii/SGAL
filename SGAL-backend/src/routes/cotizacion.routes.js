import { Router } from "express";
import {
    createCotizacion,
    getCotizaciones,
    getCotizacionById,
    updateCotizacion,
    updateCotizacionStatus,
    deleteCotizacion,
    getCotizacionesStats
} from "../controllers/cotizacion.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { cotizacionSchema, updateCotizacionSchema, statusSchema } from "../schemas/cotizacion.schema.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

// IMPORTANTE: Rutas estáticas ANTES que rutas con parámetros
// Obtener estadísticas de cotizaciones (solo admin)
router.get("/stats", verifyRole("admin"), getCotizacionesStats);

// Crear cotización
router.post("/", validateSchema(cotizacionSchema), createCotizacion);

// Obtener todas las cotizaciones
router.get("/", getCotizaciones);

// Obtener cotización por ID
router.get("/:id", getCotizacionById);

// Actualizar cotización completa
router.put("/:id", validateSchema(updateCotizacionSchema), updateCotizacion);

// Actualizar solo el estado de la cotización
router.patch("/:id/status", validateSchema(statusSchema), updateCotizacionStatus);

// Eliminar cotización (solo admin)
router.delete("/:id", verifyRole("admin"), deleteCotizacion);

export default router;