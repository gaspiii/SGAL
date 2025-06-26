import { z } from 'zod';

export const clientSchema = z.object({
    razonSocial: z.string({
        required_error: "Razón social es requerida",
    }).min(1, "Razón social no puede estar vacía").trim(),
    
    rut: z.string({
        required_error: "RUT es requerido",
    }).min(8, "RUT debe tener al menos 8 caracteres").trim(),
    
    email: z.string({
        required_error: "Email es requerido",
    }).email("Email inválido"),
    
    phone: z.string({
        required_error: "Teléfono es requerido",
    }).min(8, "Teléfono debe tener al menos 8 caracteres"),
    
    address: z.string({
        required_error: "Dirección es requerida",
    }).min(1, "Dirección no puede estar vacía"),
});

export const updateClientSchema = z.object({
    razonSocial: z.string().min(1, "Razón social no puede estar vacía").trim().optional(),
    rut: z.string().min(8, "RUT debe tener al menos 8 caracteres").trim().optional(),
    email: z.string().email("Email inválido").optional(),
    phone: z.string().min(8, "Teléfono debe tener al menos 8 caracteres").optional(),
    address: z.string().min(1, "Dirección no puede estar vacía").optional(),
});