import { z } from 'zod';

const itemSchema = z.object({
    servicio: z.string({
        required_error: "Servicio es requerido",
    }).min(1, "Servicio no puede estar vacío"),
    
    telefono: z.string({
        required_error: "Teléfono es requerido",
    }).min(8, "Teléfono debe tener al menos 8 caracteres"),
    
    nombreContacto: z.string({
        required_error: "Nombre del contacto es requerido",
    }).min(1, "Nombre del contacto no puede estar vacío"),
    
    obra: z.string({
        required_error: "Obra es requerida",
    }).min(1, "Obra no puede estar vacía"),
});

export const cotizacionSchema = z.object({
    clientId: z.string({
        required_error: "ID del cliente es requerido",
    }).regex(/^[0-9a-fA-F]{24}$/, "ID del cliente inválido"),
    
    items: z.array(itemSchema, {
        required_error: "Items son requeridos",
    }).min(1, "Debe haber al menos un item"),
    
    totalAmount: z.number({
        required_error: "Monto total es requerido",
    }).min(0, "El monto total debe ser mayor o igual a 0").optional(),
});

export const updateCotizacionSchema = z.object({
    clientId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID del cliente inválido").optional(),
    items: z.array(itemSchema).min(1, "Debe haber al menos un item").optional(),
    totalAmount: z.number().min(0, "El monto total debe ser mayor o igual a 0").optional(),
    status: z.enum(["en-revisión", "pendiente", "aprobado", "rechazado"]).optional(),
});

export const statusSchema = z.object({
    status: z.enum(["en-revisión", "pendiente", "aprobado", "rechazado"], {
        required_error: "Estado es requerido"
    }),
});