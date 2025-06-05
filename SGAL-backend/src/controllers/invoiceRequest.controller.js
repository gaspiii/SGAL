import InvoiceRequest from "../models/invoiceRequest.model.js";
import { invoiceRequestSchema } from "../schemas/invoiceRequest.schema.js";
import { z } from "zod";

// Crear nueva solicitud
export const createInvoiceRequest = async (req, res) => {
    try {
        const validatedData = invoiceRequestSchema.parse(req.body);
        const newRequest = new InvoiceRequest(validatedData);
        const saved = await newRequest.save();
        res.status(201).json(saved);
    } catch (error) {
        console.error("Error al crear solicitud:", error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: "Error interno", error });
    }
};

// Obtener todas las solicitudes (con filtros opcionales)
export const getInvoiceRequests = async (req, res) => {
    try {
        const { estado, desde, hasta } = req.query;
        const query = {};

        if (estado) query.estado = estado;
        if (desde || hasta) {
            query.fechaSolicitud = {};
            if (desde) query.fechaSolicitud.$gte = new Date(desde);
            if (hasta) query.fechaSolicitud.$lte = new Date(hasta);
        }

        const list = await InvoiceRequest.find(query);
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las solicitudes", error });
    }
};

// Obtener una solicitud por ID
export const getInvoiceRequestById = async (req, res) => {
    try {
        const request = await InvoiceRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Solicitud no encontrada" });
        res.json(request);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar la solicitud", error });
    }
};

// Actualizar solicitud por ID
export const updateInvoiceRequest = async (req, res) => {
    try {
        const validatedData = invoiceRequestSchema.partial().parse(req.body);
        const updated = await InvoiceRequest.findByIdAndUpdate(req.params.id, validatedData, { new: true });
        if (!updated) return res.status(404).json({ message: "Solicitud no encontrada" });
        res.json(updated);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: "Error al actualizar la solicitud", error });
    }
};

// Eliminar solicitud por ID
export const deleteInvoiceRequest = async (req, res) => {
    try {
        const deleted = await InvoiceRequest.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Solicitud no encontrada" });
        res.json({ message: "Solicitud eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la solicitud", error });
    }
};
