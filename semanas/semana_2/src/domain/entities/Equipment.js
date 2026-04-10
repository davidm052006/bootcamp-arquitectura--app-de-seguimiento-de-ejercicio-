/**
 * Entidad Equipment - Representa un equipo de entrenamiento
 * 
 * PRINCIPIO SOLID APLICADO: SRP (Single Responsibility Principle)
 * 
 * Responsabilidad ÚNICA: Representar un equipo de entrenamiento con sus datos.
 * 
 * Esta es una entidad simple que solo contiene datos y lógica mínima.
 */

export class Equipment {
  constructor({
    id,
    nombre,
    tipo,        // 'mancuernas', 'colchoneta', 'cuerda', 'saco_boxeo', 'barra', 'bandas_elasticas', 'peso_corporal'
    descripcion = '',
    disponible = true
  }) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.disponible = disponible;
  }

  /**
   * Marca el equipo como disponible
   */
  marcarDisponible() {
    this.disponible = true;
  }

  /**
   * Marca el equipo como no disponible
   */
  marcarNoDisponible() {
    this.disponible = false;
  }

  /**
   * Convierte el equipo a un objeto simple
   * 
   * @returns {Object} Representación simple del equipo
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      tipo: this.tipo,
      descripcion: this.descripcion,
      disponible: this.disponible
    };
  }
}
