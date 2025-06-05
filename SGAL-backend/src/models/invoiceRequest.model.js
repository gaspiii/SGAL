import mongoose from "mongoose";

const invoiceRequestSchema = new mongoose.Schema({
    solicitante: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    correoContacto: {
        type: String,
        required: true,
        match: /.+\@.+\..+/ // (opcional)
    },
    obra: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    fechaSolicitud: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        enum: ["pendiente", "aprobado", "rechazado"],
        default: "pendiente"
    },
    observaciones: {
        type: String,
        default: "Sus comentarios."
    }
}, {
    timestamps: true
});

const InvoiceRequest = mongoose.model("InvoiceRequest", invoiceRequestSchema);
export default InvoiceRequest;
