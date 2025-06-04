import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        username: {
            type: String,
            required: false, // Lo hago opcional para que coincida con el controlador
            unique: true,
            trim: true,
            sparse: true, // Permite valores null/undefined únicos
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
        // Cambiado de 'departamento' (número) a 'cargo'
        cargo: {
            type: String,
            required: true,
        },
        iniciales: {
            type: String,
            required: true,
            trim: true,
            maxlength: 4, // Limitamos las iniciales
        },
        grupos: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grupo", // Cambio a array para múltiples grupos
        }],
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);