// Repository.js - Contrato base para todos los repositorios
// Define las operaciones básicas de persistencia (CRUD)

export class Repository {
  /**
   * Guarda una entidad (CREATE o UPDATE)
   * @param {Object} entity - La entidad a guardar (Equipment, Routine, User, etc.)
   * @returns {Object} La entidad guardada
   */
  save(entity) {
    throw new Error("Debes implementar el método save() en la clase hija");
  }

  /**
   * Busca una entidad por su ID (READ)
   * @param {string} id - El ID de la entidad a buscar
   * @returns {Object|null} La entidad encontrada o null si no existe
   */
  findById(id) {
    throw new Error("Debes implementar el método findById() en la clase hija");
  }

  /**
   * Obtiene todas las entidades (READ ALL)
   * @returns {Array} Array con todas las entidades
   */
  findAll() {
    throw new Error("Debes implementar el método findAll() en la clase hija");
  }

  /**
   * Elimina una entidad por su ID (DELETE)
   * @param {string} id - El ID de la entidad a eliminar
   * @returns {boolean} true si se eliminó, false si no existía
   */
  delete(id) {
    throw new Error("Debes implementar el método delete() en la clase hija");
  }
}