/**
 * MIDDLEWARE: validate (Zod)
 *
 * Valida el body de la petición contra un schema Zod.
 * Si la validación falla → 400 Bad Request con detalles del error.
 *
 * OWASP A03: Injection — validar input antes de procesarlo
 * evita que datos malformados lleguen a la lógica de negocio.
 *
 * Uso:
 *   router.post('/register', validate(registerSchema), authController.register)
 */
import { z } from 'zod';

/**
 * Schemas de validación para los endpoints de autenticación
 */
export const registerSchema = z.object({
  nombre:   z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email:    z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').max(100),
  role:     z.enum(['user', 'admin']).optional().default('user'),
});

export const loginSchema = z.object({
  email:    z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const routineSchema = z.object({
  userId:      z.number().int().positive(),
  nombre:      z.string().min(1).max(200),
  descripcion: z.string().max(500).optional().default(''),
  activa:      z.boolean().optional().default(false),
});

/**
 * Factory: crea un middleware que valida el body contra el schema dado.
 * @param {z.ZodSchema} schema
 */
export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      }));
      return res.status(400).json({
        success: false,
        error: { message: 'Datos de entrada inválidos', details: errors, statusCode: 400 },
      });
    }
    req.body = result.data; // reemplazar con datos validados y transformados
    next();
  };
}
