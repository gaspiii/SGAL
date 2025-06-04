import {z} from 'zod';

export const registerSchema = z.object({
    name: z.string({
        required_error: "Name is required",
    }),
    email: z.string({
        message: "Invalid email",
    }),
    password: z.string({
        required_error: "Password is required",
    }).min(6, "Password must be at least 6 characters long"),
    role: z.string().optional(),
    departamento: z.number({
        required_error: "Departamento is required",
    }),
});

export const loginSchema = z.object({
    email: z.string({
        required_error: "Email is required",
    }).email({
        message: "Invalid email",
    }),
    password: z.string({
        required_error: "Password is required",
    }),
});