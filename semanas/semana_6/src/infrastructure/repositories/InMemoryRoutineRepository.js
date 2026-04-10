import { IRoutineRepository } from '../../domain/ports/secondary/IRoutineRepository.js';

/**
 * ADAPTADOR: InMemoryRoutineRepository
 *
 * Implementa IRoutineRepository con un Map en memoria.
 * Usado en tests y desarrollo — sin BD, sin conexiones externas.
 */
export class InMemoryRoutineRepository extends IRoutineRepository {
  constructor() {
    super();
    this.store = new Map();
    this.nextId = 1;
  }

  async save(routine) {
    if (!routine.id) {
      routine.id = this.nextId++;
    }
    this.store.set(routine.id, { ...routine }); // guardamos copia
    return this.store.get(routine.id);
  }

  async findById(id) {
    return this.store.get(Number(id)) ?? null;
  }

  async findAll() {
    return Array.from(this.store.values());
  }

  async findByUserId(userId) {
    return Array.from(this.store.values()).filter((r) => r.userId === Number(userId));
  }

  async update(id, data) {
    const routine = this.store.get(Number(id));
    if (!routine) return null;
    const updated = { ...routine, ...data };
    this.store.set(Number(id), updated);
    return updated;
  }

  async delete(id) {
    return this.store.delete(Number(id));
  }

  /**
   * Desactiva todas las rutinas de un usuario excepto una.
   * Implementa la regla de negocio a nivel de persistencia.
   */
  async deactivateAllForUser(userId, exceptRoutineId = null) {
    for (const [id, routine] of this.store.entries()) {
      if (routine.userId === Number(userId)) {
        if (exceptRoutineId !== null && routine.id === exceptRoutineId) continue;
        if (routine.activa) {
          this.store.set(id, { ...routine, activa: false, ultimaActualizacion: new Date() });
        }
      }
    }
  }
}
