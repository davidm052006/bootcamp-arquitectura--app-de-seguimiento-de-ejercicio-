// Equipment.js - Entidad de Equipamiento
// Representa un equipo de ejercicio en FitWell

export class Equipment {
  // Atributos privados (solo accesibles dentro de la clase)
  #id;
  #nombre;
  #tipo;
  #disponible;

  /**
   * Constructor: se ejecuta cuando haces "new Equipment(...)"
   * @param {string} id - Identificador único del equipo
   * @param {string} nombre - Nombre del equipo (ej: "Mancuernas")
   * @param {string} tipo - Tipo de equipo (ej: "PESO_LIBRE", "CARDIO", "ACCESORIO")
   * @param {boolean} disponible - Si está disponible para usar (default: true)
   */
  constructor(id, nombre, tipo, disponible = true) {
    this.#id = id;
    this.#nombre = nombre;
    this.#tipo = tipo;
    this.#disponible = disponible;
  }

  // ========== GETTERS (para leer atributos privados) ==========
  
  getId() {
    return this.#id;
  }

  getNombre() {
    return this.#nombre;
  }

  getTipo() {
    return this.#tipo;
  }

  isDisponible() {
    return this.#disponible;
  }

  // ========== MÉTODOS DE NEGOCIO ==========
  
  /**
   * Marca el equipo como no disponible (ej: está en uso o roto)
   */
  marcarComoNoDisponible() {
    this.#disponible = false;
  }

  /**
   * Marca el equipo como disponible nuevamente
   */
  marcarComoDisponible() {
    this.#disponible = true;
  }

  /**
   * Método para mostrar información del equipo (útil para debugging)
   */
  toString() {
    return `Equipment { id: ${this.#id}, nombre: ${this.#nombre}, tipo: ${this.#tipo}, disponible: ${this.#disponible} }`;
  }

  /**
   * Convierte el equipo a un objeto simple (útil para JSON)
   */
  toJSON() {
    return {
      id: this.#id,
      nombre: this.#nombre,
      tipo: this.#tipo,
      disponible: this.#disponible
    };
  }
}