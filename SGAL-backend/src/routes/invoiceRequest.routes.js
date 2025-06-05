import express from "express";
import { createInvoiceRequest, getInvoiceRequests } from "../controllers/invoiceRequest.controller.js";
import validateToken from "../middlewares/validateToken.js";

const router = express.Router();

// Ruta para crear una solicitud de cotización
router.post("/", validateToken, createInvoiceRequest);

// Ruta para listar solicitudes
router.get("/", validateToken, getInvoiceRequests);

export default router;
