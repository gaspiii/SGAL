import mongoose from "mongoose";

const cotizacionSchema = new mongoose.Schema(
    {
        client: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Client",
            required: true,
        },
        items: [
            {
                servicio: {
                    type: String,
                    required: true,
                },
                telefono: {
                    type: String,
                    required: true,
                },
                nombreContacto: {
                    type: String,
                    required: true,
                },
                obra: {
                    type: String,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number
        },
        status: {
            type: String,
            enum: ["pendiente", "aprobado", "rechazado"],
            default: "pendiente",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Cotizacion", cotizacionSchema);