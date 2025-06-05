import { z } from 'zod';

export const invoiceRequestSchema = z.object({
    solicitante: z.string({
        required_error: "Nombre del solicitante es requerido"
    }).min(1, "Campo no puede estar vacío"),

    telefono: z.string({
        required_error: "Teléfono es requerido"
    }).min(9, "Teléfono debe tener al menos 9 caracteres"),

    correoContacto: z.string({
        required_error: "Correo electrónico es requerido"
    }).email("Debe ser un correo electrónico válido"),

    obra: z.string({
        required_error: "Obra es requerida"
    }).min(1, "Campo no puede estar vacío"),

    descripcion: z.string({
        required_error: "Descripción es requerida"
    }).min(1, "Campo no puede estar vacío"),

    estado: z.enum(["pendiente", "aprobado", "rechazado"]).optional(),

    observaciones: z.string().optional()
});
