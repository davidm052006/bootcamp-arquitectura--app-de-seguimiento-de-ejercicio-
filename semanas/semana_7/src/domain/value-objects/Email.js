/**
 * VALUE OBJECT: Email
 * Inmutable. Valida formato. Se define por su valor, no por identidad.
 */
export class Email {
  static #REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value) {
    if (!value || typeof value !== 'string') throw new Error('El email es requerido');
    const normalized = value.trim().toLowerCase();
    if (!Email.#REGEX.test(normalized)) throw new Error(`Email inválido: "${value}"`);
    this.value = normalized;
    Object.freeze(this);
  }

  equals(other) { return other instanceof Email && this.value === other.value; }
  toString()    { return this.value; }
}
