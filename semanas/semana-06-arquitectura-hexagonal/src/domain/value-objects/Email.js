/**
 * VALUE OBJECT: Email
 *
 * Un Value Object es inmutable y se define por su valor, no por su identidad.
 * Dos Email con el mismo valor son iguales — no importa si son objetos distintos.
 *
 * Responsabilidad: garantizar que un email siempre sea válido.
 * Si el email es inválido, el objeto nunca llega a existir → falla en el constructor.
 *
 * Diferencia con una entidad: Email no tiene id, no cambia, no se guarda solo.
 * Es un atributo de User que lleva su propia validación encapsulada.
 */
export class Email {
  // Expresión regular básica para validar formato de email
  static #REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /**
   * @param {string} value - el email a encapsular
   * @throws {Error} si el formato es inválido
   */
  constructor(value) {
    if (!value || typeof value !== 'string') {
      throw new Error('El email es requerido');
    }

    const normalized = value.trim().toLowerCase();

    if (!Email.#REGEX.test(normalized)) {
      throw new Error(`Email inválido: "${value}"`);
    }

    // Inmutable: usamos Object.freeze para que nadie pueda cambiar this.value
    this.value = normalized;
    Object.freeze(this);
  }

  /**
   * Compara dos Email por valor (no por referencia de objeto).
   * @param {Email} other
   */
  equals(other) {
    return other instanceof Email && this.value === other.value;
  }

  toString() {
    return this.value;
  }
}
