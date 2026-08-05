/**
 * PasswordService — Adaptador de seguridad para contraseñas
 *
 * Usa bcryptjs para hashear y verificar contraseñas.
 * El dominio NO conoce bcrypt — solo recibe/entrega strings opacos.
 *
 * ¿Por qué bcrypt?
 *   - Incluye un "salt" aleatorio automáticamente (evita rainbow tables)
 *   - Es lento a propósito (dificulta ataques de fuerza bruta)
 *   - ROUNDS controla cuánto tarda: más rounds = más seguro pero más lento
 *     Recomendado: 10-12 para producción
 */
import bcrypt from 'bcryptjs';

export class PasswordService {
  constructor(rounds = 10) {
    // Rounds desde variable de entorno o valor por defecto
    this.rounds = parseInt(process.env.BCRYPT_ROUNDS ?? rounds, 10);
  }

  /**
   * Hashea una contraseña en texto plano.
   * @param {string} plainPassword
   * @returns {Promise<string>} hash seguro para guardar en BD
   */
  async hash(plainPassword) {
    if (!plainPassword || plainPassword.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    return bcrypt.hash(plainPassword, this.rounds);
  }

  /**
   * Verifica si una contraseña coincide con su hash.
   * @param {string} plainPassword - lo que el usuario escribió
   * @param {string} hash - lo que está guardado en BD
   * @returns {Promise<boolean>}
   */
  async verify(plainPassword, hash) {
    if (!plainPassword || !hash) return false;
    return bcrypt.compare(plainPassword, hash);
  }
}
