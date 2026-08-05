/**
 * MIDDLEWARE: authenticate
 *
 * Verifica que la petición incluye un JWT válido en el header Authorization.
 * Si es válido, agrega req.user = { userId, role } para que los siguientes
 * middlewares y controladores sepan quién hace la petición.
 *
 * Header esperado: Authorization: Bearer <token>
 *
 * OWASP A07: si el token es inválido o falta, responde 401 con mensaje genérico.
 */
import { TokenService } from '../../../infrastructure/security/TokenService.js';

const tokenService = new TokenService();

export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Verificar que el header existe y tiene formato "Bearer <token>"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { message: 'Token de autenticación requerido', statusCode: 401 },
    });
  }

  const token = authHeader.slice(7); // quitar "Bearer "

  try {
    const payload = tokenService.verify(token);
    req.user = { userId: payload.userId, role: payload.role }; // disponible en el resto del flujo
    next();
  } catch {
    // Mensaje genérico — no revelar si el token expiró o es inválido
    return res.status(401).json({
      success: false,
      error: { message: 'No autorizado', statusCode: 401 },
    });
  }
}
