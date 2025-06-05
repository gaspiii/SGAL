import express from "express";
import {
    createInvoiceRequest,
    getInvoiceRequests,
    getInvoiceRequestById,
    updateInvoiceRequest,
    updateInvoiceStatus,
    deleteInvoiceRequest
} from "../controllers/invoiceRequest.controller.js";

import { authRequired } from "../middlewares/validateToken.js";
import { verifyRole } from "../middlewares/verifyRole.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { invoiceRequestSchema } from "../schemas/invoiceRequest.schema.js";

const router = express.Router();


// Ruta pública para obtener solicitudes sin token
router.get("/public", getInvoiceRequests);

// Todas las rutas protegidas con autenticación
router.use(authRequired);

// Crear una nueva solicitud (requiere validación de schema)
router.post(
    "/",
    validateSchema(invoiceRequestSchema),
    createInvoiceRequest
);

// Listar todas las solicitudes.
router.get("/", getInvoiceRequests);

// Obtener una solicitud específica por ID
router.get("/:id", getInvoiceRequestById);

// Actualizar una solicitud completa por ID
router.put(
    "/:id",
    validateSchema(invoiceRequestSchema.partial()),
    updateInvoiceRequest
);

// Cambiar únicamente el estado de una solicitud
router.patch("/:id/status", updateInvoiceStatus);

// Eliminar una solicitud (solo administrador)
router.delete(
    "/:id",
    verifyRole("admin"),
    deleteInvoiceRequest
);

export default router;
