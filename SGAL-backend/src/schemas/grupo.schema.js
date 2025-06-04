import { z } from 'zod';

export const grupoSchema = z.object({
    nombre: z.string({
        required_error: "Nombre del grupo es requerido",
    }).min(1, "Nombre del grupo no puede estar vacío").trim(),
    
    descripcion: z.string({
        required_error: "Descripción es requerida",
    }).min(1, "Descripción no puede estar vacía").trim(),
    
    miembros: z.array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de usuario inválido")
    ).optional(),
    
    roles: z.array(
        z.enum(["general", "gestion solicitudes", "gestion cotizaciones"])
    ).optional(),
});

export const updateGrupoSchema = z.object({
    nombre: z.string().min(1, "Nombre del grupo no puede estar vacío").trim().optional(),
    descripcion: z.string().min(1, "Descripción no puede estar vacía").trim().optional(),
    miembros: z.array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de usuario inválido")
    ).optional(),
    roles: z.array(
        z.enum(["general", "gestion solicitudes", "gestion cotizaciones"])
    ).optional(),
});

export const addMiembroSchema = z.object({
    userId: z.string({
        required_error: "ID del usuario es requerido",
    }).regex(/^[0-9a-fA-F]{24}$/, "ID de usuario inválido"),
});