import { Router } from "express";
import {
    createSolicitud,
    getSolicitudes,
    getSolicitudById,
    aprobarSolicitud,
    rechazarSolicitud,
    getSolicitudesStats
} from "../controllers/solicitud.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { solicitudSchema, aprobarSolicitudSchema } from "../schemas/solicitud.schema.js";

const router = Router();

// Todas las rutas requieren autenticación
router.use(authRequired);

// Obtener estadísticas de solicitudes (solo admin)
router.get("/stats", verifyRole("admin"), getSolicitudesStats);

// Crear solicitud
router.post("/", validateSchema(solicitudSchema), createSolicitud);

// Obtener todas las solicitudes
router.get("/", getSolicitudes);

// Obtener solicitud por ID
router.get("/:id", getSolicitudById);

// Aprobar solicitud (solo admin)
router.patch("/:id/aprobar", verifyRole("admin"), validateSchema(aprobarSolicitudSchema), aprobarSolicitud);

// Rechazar solicitud (solo admin)
router.patch("/:id/rechazar", verifyRole("admin"), validateSchema(aprobarSolicitudSchema), rechazarSolicitud);

export default router; 