import { z } from 'zod';

export const invoiceRequestSchema = z.object({
    solicitante: z.string({
        required_error: "El nombre del solicitante es obligatorio"
    }).trim().min(1, "El nombre del solicitante no puede estar vacío"),

    telefono: z.string({
        required_error: "El teléfono es obligatorio"
    })
        .min(9, "El teléfono debe tener al menos 9 caracteres")
        .max(15, "El teléfono no puede superar los 15 caracteres")
        .regex(/^\d+$/, "El teléfono solo debe contener números"),

    correoContacto: z.string({
        required_error: "El correo electrónico es obligatorio"
    }).trim().email("Debe ser un correo electrónico válido"),

    obra: z.string({
        required_error: "El nombre de la obra es obligatorio"
    }).trim().min(1, "El nombre de la obra no puede estar vacío"),

    descripcion: z.string({
        required_error: "La descripción es obligatoria"
    }).trim().min(1, "La descripción no puede estar vacía"),

    estado: z.enum(["pendiente", "aprobado", "rechazado"], {
        invalid_type_error: "Estado inválido"
    }).optional(),

    observaciones: z.string().trim().optional()
});