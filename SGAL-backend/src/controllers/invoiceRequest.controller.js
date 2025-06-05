import InvoiceRequest from "../models/invoiceRequest.model.js";
import { invoiceRequestSchema } from "../schemas/invoiceRequest.schema.js";
import { z } from "zod";

export const createInvoiceRequest = async (req, res) => {
    try {
        const validatedData = invoiceRequestSchema.parse(req.body);
        const newRequest = new InvoiceRequest(validatedData);
        const saved = await newRequest.save();
        res.status(201).json(saved);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: "Error al crear la solicitud", error });
    }
};

export const getInvoiceRequests = async (req, res) => {
    try {
        const list = await InvoiceRequest.find();
        res.json(list);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener las solicitudes", error });
    }
};
