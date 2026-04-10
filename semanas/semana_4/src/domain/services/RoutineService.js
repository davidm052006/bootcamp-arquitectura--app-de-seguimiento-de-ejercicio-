import { ApiError } from '../../utils/api-error.js';
import { Routine } from '../entities/Routine.js';

export class RoutineService {
  constructor(routineRepository, userRepository) {
    this.routineRepository = routineRepository;
    this.userRepository = userRepository;
  }

  createRoutine({ userId, nombre, descripcion = '', activa = false }) {
    this.assertUserExists(userId);

    if (!nombre || String(nombre).trim() === '') {
      throw new ApiError('El nombre de la rutina es obligatorio', 400);
    }

    if (typeof activa !== 'boolean') {
      throw new ApiError('El campo "activa" debe ser boolean', 400);
    }

    if (activa) {
      // Regla de negocio: como máximo una rutina activa por usuario.
      this.routineRepository.deactivateAllForUser(userId, null);
    }

    const routine = new Routine({
      id: null,
      userId,
      nombre: String(nombre).trim(),
      descripcion: String(descripcion ?? ''),
      activa,
    });

    return this.routineRepository.create(routine);
  }

  getRoutineById(id) {
    const routine = this.routineRepository.findById(id);
    if (!routine) throw new ApiError('Rutina no encontrada', 404);
    return routine;
  }

  listRoutines({ userId = undefined, activa = undefined } = {}) {
    const all = this.routineRepository.findAll();
    return all.filter((r) => {
      if (userId !== undefined && r.userId !== userId) return false;
      if (activa !== undefined && r.activa !== activa) return false;
      return true;
    });
  }

  updateRoutine(id, updateData) {
    const routine = this.getRoutineById(id);
    // Para mantener la regla de "1 activa por usuario", no permitimos cambiar el userId de una rutina.
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
      userId: nextUserId, // forzamos consistencia
    });

    if (!updated) throw new ApiError('Rutina no encontrada', 404);
    return updated;
  }

  deleteRoutine(id) {
    const routine = this.getRoutineById(id);
    const deleted = this.routineRepository.delete(routine.id);
    if (!deleted) throw new ApiError('Rutina no encontrada', 404);
  }

  assertUserExists(userId) {
    if (userId === undefined || userId === null || Number.isNaN(Number(userId))) {
      throw new ApiError('userId es requerido y debe ser numérico', 400);
    }
    const user = this.userRepository.findById(Number(userId));
    if (!user) throw new ApiError('Usuario no encontrado', 404);
  }
}

