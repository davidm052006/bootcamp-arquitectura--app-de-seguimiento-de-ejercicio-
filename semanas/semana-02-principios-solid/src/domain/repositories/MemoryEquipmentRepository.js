// MemoryEquipmentRepository.js
// Implementación del patrón Repository para Equipment
// Guarda equipos en memoria usando un Map

import { Repository } from '../interfaces/Repository.js';

export class MemoryEquipmentRepository extends Repository {
  // Map privado para guardar equipos (clave: id, valor: Equipment)
  #equipments = new Map();
  
  /**
   * Guarda un equipo en memoria
   * @param {Equipment} equipment - El equipo a guardar
   * @returns {Equipment} El equipo guardado
   */
  save(equipment) {
    this.#equipments.set(equipment.getId(), equipment);
    return equipment;
  }
  
  /**
   * Busca un equipo por su ID
   * @param {string} id - El ID del equipo a buscar
   * @returns {Equipment|null} El equipo encontrado o null si no existe
   */
  findById(id) {
    return this.#equipments.get(id) || null;
  }
  
  /**
   * Obtiene todos los equipos
   * @returns {Array<Equipment>} Array con todos los equipos
   */
  findAll() {
    return Array.from(this.#equipments.values());
  }
  
  /**
   * Elimina un equipo por su ID
   * @param {string} id - El ID del equipo a eliminar
   * @returns {boolean} true si se eliminó, false si no existía
   */
  delete(id) {
    return this.#equipments.delete(id);
  }
}
