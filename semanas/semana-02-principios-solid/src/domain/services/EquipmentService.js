// EquipmentService.js
// Servicio de lógica de negocio para Equipment
// Aplica DIP: depende de Repository (abstracción), no de implementación concreta

import { Equipment } from '../entities/Equipment.js';

export class EquipmentService {
  /**
   * Constructor con inyección de dependencias (DIP)
   * @param {Repository} equipmentRepository - Repositorio de equipos (abstracción)
   */
  constructor(equipmentRepository) {
    this.repository = equipmentRepository;
  }
  
  /**
   * Agrega un nuevo equipo
   * @param {string} nombre - Nombre del equipo
   * @param {string} tipo - Tipo de equipo (PESO_LIBRE, CARDIO, ACCESORIO)
   * @returns {Equipment} El equipo creado
   */
  addEquipment(nombre, tipo) {
    const id = this.generateId();
    const equipment = new Equipment(id, nombre, tipo);
    return this.repository.save(equipment);
  }
  
  /**
   * Lista todos los equipos
   * @returns {Array<Equipment>} Array con todos los equipos
   */
  listEquipment() {
    return this.repository.findAll();
  }
  
  /**
   * Busca un equipo por ID
   * @param {string} id - ID del equipo
   * @returns {Equipment|null} El equipo encontrado o null
   */
  getEquipmentById(id) {
    return this.repository.findById(id);
  }
  
  /**
   * Elimina un equipo
   * @param {string} id - ID del equipo a eliminar
   * @returns {boolean} true si se eliminó, false si no existía
   */
  removeEquipment(id) {
    return this.repository.delete(id);
  }
  
  /**
   * Lista solo equipos disponibles
   * @returns {Array<Equipment>} Array con equipos disponibles
   */
  listAvailableEquipment() {
    const all = this.repository.findAll();
    return all.filter(equipment => equipment.isDisponible());
  }
  
  /**
   * Genera un ID único para equipos
   * @returns {string} ID único
   */
  generateId() {
    return `eq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
