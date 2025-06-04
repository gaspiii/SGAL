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
            required: true,
            unique: true,
            trim: true,
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
        cargo: {
            type: String,
            required: true,
        },
        iniciales: {
            type: String,
            required: true,
            trim: true,
        },
        grupos: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grupo", // Referencia al modelo Grupo
        },
    },
    // timestamps agrega automáticamente createdAt y updatedAt
    { timestamps: true }
);

export default mongoose.model("User", userSchema);