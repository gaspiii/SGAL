import InvoiceRequest from "../models/invoiceRequest.model.js";
import { invoiceRequestSchema } from "../schemas/invoiceRequest.schema.js";
import { z } from "zod";

// Crea una nueva solicitud
export const createInvoiceRequest = async (req, res) => {
    try {
        const validatedData = invoiceRequestSchema.parse(req.body);
        const newRequest = new InvoiceRequest(validatedData);
        const saved = await newRequest.save();
        res.status(201).json(saved);
    } catch (error) {
        console.log("Error al crear solicitud de cotización:", error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: "Error al crear la solicitud", error });
    }
};

// Obtener todas las solicitudes (con filtros opcionales)
export const getInvoiceRequests = async (req, res) => {
    try {
        const { estado, solicitante } = req.query;
        const query = {};

        if (estado) query.estado = estado;
        if (solicitante) query.solicitante = { $regex: solicitante, $options: "i" };

        const list = await InvoiceRequest.find(query).sort({ createdAt: -1 });
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las solicitudes", error });
    }
};

// Obtener una solicitud por ID
export const getInvoiceRequestById = async (req, res) => {
    try {
        const solicitud = await InvoiceRequest.findById(req.params.id);
        if (!solicitud) return res.status(404).json({ message: "Solicitud no encontrada" });
        res.json(solicitud);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la solicitud", error });
    }
};

// Actualizar una solicitud por ID
export const updateInvoiceRequest = async (req, res) => {
    try {
        const validatedData = invoiceRequestSchema.partial().parse(req.body);
        const updated = await InvoiceRequest.findByIdAndUpdate(
            req.params.id,
            validatedData,
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Solicitud no encontrada" });
        res.json(updated);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: "Error al actualizar la solicitud", error });
    }
};

// Cambiar solo el estado
export const updateInvoiceStatus = async (req, res) => {
    try {
        const { estado } = req.body;
        if (!["pendiente", "aprobado", "rechazado"].includes(estado)) {
            return res.status(400).json({ message: "Estado no válido" });
        }

        const updated = await InvoiceRequest.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: "Solicitud no encontrada" });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el estado", error });
    }
};

// Eliminar una solicitud por ID
export const deleteInvoiceRequest = async (req, res) => {
    try {
        const deleted = await InvoiceRequest.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Solicitud no encontrada" });
        res.json({ message: "Solicitud eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la solicitud", error });
    }
};