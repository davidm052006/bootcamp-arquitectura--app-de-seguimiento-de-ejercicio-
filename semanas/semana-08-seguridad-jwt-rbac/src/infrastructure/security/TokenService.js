/**
 * TokenService — Adaptador de seguridad para JWT
 *
 * JWT (JSON Web Token) es un token firmado digitalmente.
 * Contiene un payload (datos) + una firma que solo el servidor puede verificar.
 *
 * Estructura de un JWT:
 *   header.payload.signature
 *   eyJhbGc... . eyJ1c2VyS... . SflKxwRJ...
 *
 * El payload es visible (base64) pero NO modificable sin invalidar la firma.
 * Por eso NUNCA pongas datos sensibles en el payload.
 *
 * Payload que usamos: { userId, role }
 *   - userId: para saber quién hace la petición
 *   - role: para RBAC (saber qué puede hacer)
 */
import jwt from 'jsonwebtoken';

export class TokenService {
  constructor() {
    // El secret DEBE venir de variable de entorno — nunca hardcodeado
    this.secret = process.env.JWT_SECRET ?? 'dev-secret-change-in-production-min-32-chars';
    this.expiresIn = process.env.JWT_EXPIRES_IN ?? '15m'; // 15 minutos por defecto
  }

  /**
   * Genera un JWT firmado con el payload dado.
   * @param {{ userId: number, role: string }} payload
   * @returns {string} token JWT
   */
  sign(payload) {
    if (!payload.userId || !payload.role) {
      throw new Error('El payload debe incluir userId y role');
    }
    return jwt.sign(
      { userId: payload.userId, role: payload.role },
      this.secret,
      { expiresIn: this.expiresIn, algorithm: 'HS256' }
    );
  }

  /**
   * Verifica y decodifica un JWT.
   * @param {string} token
   * @returns {{ userId: number, role: string, iat: number, exp: number }}
   * @throws {Error} si el token es inválido o expiró
   */
  verify(token) {
    try {
      return jwt.verify(token, this.secret, { algorithms: ['HS256'] });
    } catch (err) {
      // Mensaje genérico — no revelar detalles del error (OWASP)
      throw new Error('Token inválido o expirado');
    }
  }
}
