import { z } from 'zod';

export const solicitudSchema = z.object({
    clientId: z.string({
        required_error: "ID del cliente es requerido",
    }).regex(/^[0-9a-fA-F]{24}$/, "ID del cliente inválido"),
    
    nombreContacto: z.string({
        required_error: "Nombre del contacto es requerido",
    }).min(1, "Nombre del contacto no puede estar vacío").trim(),
    
    telefono: z.string({
        required_error: "Teléfono es requerido",
    }).min(8, "Teléfono debe tener al menos 8 caracteres").trim(),
    
    email: z.string({
        required_error: "Email es requerido",
    }).email("Email inválido").trim(),
    
    nombreObra: z.string({
        required_error: "Nombre de la obra es requerido",
    }).min(1, "Nombre de la obra no puede estar vacío").trim(),
    
    ubicacionObra: z.string({
        required_error: "Ubicación de la obra es requerida",
    }).min(1, "Ubicación de la obra no puede estar vacía").trim(),
    
    descripcionServicios: z.string({
        required_error: "Descripción de servicios es requerida",
    }).min(1, "Descripción de servicios no puede estar vacía").trim(),
    
    prioridad: z.enum(["Alta", "Media", "Baja"]).optional(),
});

export const updateSolicitudSchema = z.object({
    status: z.enum(["en-revisión", "aprobado", "rechazado"], {
        required_error: "Estado es requerido"
    }),
    observaciones: z.string().trim().optional(),
});

export const aprobarSolicitudSchema = z.object({
    observaciones: z.string().trim().optional(),
}); 