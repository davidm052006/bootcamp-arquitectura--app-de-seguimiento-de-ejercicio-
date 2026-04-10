/**
 * Rate Limiters — Protección contra fuerza bruta y abuso
 *
 * OWASP A07: Identification and Authentication Failures
 * Un atacante puede intentar miles de combinaciones de contraseña.
 * El rate limiter bloquea IPs que hacen demasiadas peticiones.
 *
 * Dos limiters con configuraciones distintas:
 *   - authLimiter: estricto para /auth (login/registro)
 *   - apiLimiter: general para el resto de la API
 */
import rateLimit from 'express-rate-limit';

/**
 * Limiter estricto para endpoints de autenticación.
 * Máximo 10 intentos por IP en 15 minutos.
 * Si supera el límite → 429 Too Many Requests
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10,
  message: {
    success: false,
    error: { message: 'Demasiados intentos. Intenta de nuevo en 15 minutos.', statusCode: 429 },
  },
  standardHeaders: true,  // incluye headers RateLimit-* en la respuesta
  legacyHeaders: false,
});

/**
 * Limiter general para toda la API.
 * Máximo 100 peticiones por IP en 15 minutos.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: { message: 'Límite de peticiones excedido.', statusCode: 429 },
  },
  standardHeaders: true,
  legacyHeaders: false,
});
