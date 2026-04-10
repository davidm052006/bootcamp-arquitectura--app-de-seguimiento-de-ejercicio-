/**
 * USE CASE: GetRoutineUseCase
 *
 * Consulta de rutinas — obtener una por id o listar con filtros.
 * Es el use case más simple: solo carga y devuelve datos.
 * No modifica estado, no notifica.
 *
 * Separar consultas de comandos (CQRS básico):
 *   - Comandos: CreateRoutineUseCase, UpdateRoutineUseCase → modifican estado
 *   - Consultas: GetRoutineUseCase → solo leen
 */
export class GetRoutineUseCase {
  constructor(routineRepository) {
    this.routineRepository = routineRepository;
  }

  /**
   * Obtiene una rutina por id.
   * @param {number} id
   */
  async getById(id) {
    const routine = await this.routineRepository.findById(id);
    if (!routine) throw new Error('Rutina no encontrada');
    return routine;
  }

  /**
   * Lista rutinas con filtros opcionales.
   * @param {{ userId?: number, activa?: boolean }} filters
   */
  async list({ userId, activa } = {}) {
    const all = await this.routineRepository.findAll();
    return all.filter((r) => {
      if (userId !== undefined && r.userId !== Number(userId)) return false;
      if (activa !== undefined && r.activa !== activa) return false;
      return true;
    });
  }
}
