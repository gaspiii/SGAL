import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
    {
        razonSocial: {
            type: String,
            required: true,
            trim: true,
        },
        rut:{
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
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        }
    },
    { timestamps: true }
);

export default mongoose.model("Client", clientSchema);