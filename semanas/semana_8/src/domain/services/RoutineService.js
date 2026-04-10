import { ApiError } from '../../utils/api-error.js';
import { RoutineFactory } from '../../patterns/factory/RoutineFactory.js';

/**
 * RoutineService — refactorizado con:
 *   - Factory Method: delega la creación de Routine a RoutineFactory
 *   - Observer: emite eventos al EventBus en lugar de hacer todo inline
 */
export class RoutineService {
  /**
   * @param {object} routineRepository
   * @param {object} userRepository
   * @param {import('../../patterns/observer/EventBus.js').EventBus} eventBus
   */
  constructor(routineRepository, userRepository, eventBus) {
    this.routineRepository = routineRepository;
    this.userRepository = userRepository;
    this.eventBus = eventBus; // Observer: recibe el bus por inyección de dependencias
  }

  createRoutine({ userId, nombre, descripcion = '', activa = false, tipo = 'basica' }) {
    this.assertUserExists(userId);

    if (!nombre || String(nombre).trim() === '') {
      throw new ApiError('El nombre de la rutina es obligatorio', 400);
    }
    if (typeof activa !== 'boolean') {
      throw new ApiError('El campo "activa" debe ser boolean', 400);
    }

    if (activa) {
      this.routineRepository.deactivateAllForUser(userId, null);
    }

    // ✅ FACTORY METHOD: ya no hacemos "new Routine(...)" aquí
    const routine = RoutineFactory.create(tipo, {
      userId,
      nombre: String(nombre).trim(),
      descripcion,
    });

    // Si el body pide activa=true, sobreescribimos el default de la factory
    if (activa !== undefined) routine.activa = Boolean(activa);

    const saved = this.routineRepository.create(routine);

    // ✅ OBSERVER: emitimos evento — los observers reaccionan sin que el servicio sepa quiénes son
    this.eventBus.emit('routine.created', { event: 'routine.created', payload: saved.toJSON() });

    return saved;
  }

  getRoutineById(id) {
    const routine = this.routineRepository.findById(id);
    if (!routine) throw new ApiError('Rutina no encontrada', 404);
    return routine;
  }

  listRoutines({ userId = undefined, activa = undefined } = {}) {
    return this.routineRepository.findAll().filter((r) => {
      if (userId !== undefined && r.userId !== userId) return false;
      if (activa !== undefined && r.activa !== activa) return false;
      return true;
    });
  }

  updateRoutine(id, updateData) {
    const routine = this.getRoutineById(id);

    if (updateData.userId !== undefined && Number(updateData.userId) !== routine.userId) {
      throw new ApiError('No se permite cambiar userId de una rutina existente', 400);
    }

    const nextUserId = routine.userId;
    this.assertUserExists(nextUserId);

    if (updateData.activa === true) {
      this.routineRepository.deactivateAllForUser(nextUserId, routine.id);
    }

    const updated = this.routineRepository.update(id, {
      ...updateData,
      nombre: updateData.nombre !== undefined ? String(updateData.nombre).trim() : undefined,
      descripcion: updateData.descripcion !== undefined ? String(updateData.descripcion) : undefined,
      userId: nextUserId,
    });

    if (!updated) throw new ApiError('Rutina no encontrada', 404);

    // ✅ OBSERVER: emitimos evento si se activó
    if (updateData.activa === true) {
      this.eventBus.emit('routine.activated', { event: 'routine.activated', payload: updated.toJSON() });
    }

    return updated;
  }

  deleteRoutine(id) {
    const routine = this.getRoutineById(id);
    const deleted = this.routineRepository.delete(routine.id);
    if (!deleted) throw new ApiError('Rutina no encontrada', 404);

    // ✅ OBSERVER: emitimos evento de eliminación
    this.eventBus.emit('routine.deleted', { event: 'routine.deleted', payload: routine.toJSON() });
  }

  assertUserExists(userId) {
    if (userId === undefined || userId === null || Number.isNaN(Number(userId))) {
      throw new ApiError('userId es requerido y debe ser numérico', 400);
    }
    const user = this.userRepository.findById(Number(userId));
    if (!user) throw new ApiError('Usuario no encontrado', 404);
  }
}
