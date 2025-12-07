import { z } from "zod"

// Esquema para el Registro 
export const registerSchema = z.object({
  // .email() agregado para asegura formato
  email: z.string().email("El formato del email es inválido").min(1, 'El email es obligatorio'),

  // Validación de longitud min para la contraseña
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

// Esquema para el Login 
export const loginSchema = z.object({
  email: z.string().email("El formato del email es inválido"),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});