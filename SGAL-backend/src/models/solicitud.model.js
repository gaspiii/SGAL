import mongoose from "mongoose";

const solicitudSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        nombreContacto: {
            type: String,
            required: true,
            trim: true,
        },
        telefono: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        nombreObra: {
            type: String,
            required: true,
            trim: true,
        },
        ubicacionObra: {
            type: String,
            required: true,
            trim: true,
        },
        descripcionServicios: {
            type: String,
            required: true,
            trim: true,
        },
        prioridad: {
            type: String,
            enum: ["Alta", "Media", "Baja"],
            default: "Media",
        },
        status: {
            type: String,
            enum: ["en-revisión", "aprobado", "rechazado"],
            default: "en-revisión",
        },
        observaciones: {
            type: String,
            trim: true,
        },
        cotizacionGenerada: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cotizacion",
        },
        aprobadoPor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        fechaAprobacion: {
            type: Date,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Solicitud", solicitudSchema); 