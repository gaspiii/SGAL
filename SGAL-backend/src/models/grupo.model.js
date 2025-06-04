import mongoose from "mongoose";

const grupoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        descripcion: {
            type: String,
            required: true,
            trim: true,
        },
        miembros: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Referencia al modelo User
            },
        ],
        roles: [
            {
                type: String,
                enum: ["general", "gestion solicitudes", "gestion cotizaciones"], // Roles que pueden tener los miembros del grupo
                default: "general",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Grupo", grupoSchema);
