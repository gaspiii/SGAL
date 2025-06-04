import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string({
        required_error: "Nombre es requerido",
    }).min(1, "Nombre no puede estar vacío").trim(),
    
    email: z.string({
        required_error: "Email es requerido",
    }).email("Email inválido"),
    
    password: z.string({
        required_error: "Contraseña es requerida",
    }).min(6, "La contraseña debe tener al menos 6 caracteres"),
    
    role: z.enum(["admin", "user"]).optional(),
    
    cargo: z.string({
        required_error: "Cargo es requerido",
    }).min(1, "Cargo no puede estar vacío").trim(),
    
    iniciales: z.string({
        required_error: "Iniciales son requeridas",
    }).min(2, "Las iniciales deben tener al menos 2 caracteres").max(4, "Las iniciales no pueden tener más de 4 caracteres").trim(),
    
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").trim().optional(),
});

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email es requerido",
    }).email("Email inválido"),
    
    password: z.string({
        required_error: "Contraseña es requerida",
    }),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Nombre no puede estar vacío").trim().optional(),
    email: z.string().email("Email inválido").optional(),
    role: z.enum(["admin", "user"]).optional(),
    cargo: z.string().min(1, "Cargo no puede estar vacío").trim().optional(),
    iniciales: z.string().min(2, "Las iniciales deben tener al menos 2 caracteres").max(4, "Las iniciales no pueden tener más de 4 caracteres").trim().optional(),
    username: z.string().min(3, "El nombre de usuario debe tener al menos 3 caracteres").trim().optional(),
    grupos: z.array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de grupo inválido")
    ).optional(),
});