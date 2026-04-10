export class GetRoutineUseCase {
  constructor(routineRepository) { this.routineRepository = routineRepository; }

  async getById(id) {
    const routine = await this.routineRepository.findById(id);
    if (!routine) throw new Error('Rutina no encontrada');
    return routine;
  }

  async list({ userId, activa } = {}) {
    const all = await this.routineRepository.findAll();
    return all.filter((r) => {
      if (userId !== undefined && r.userId !== Number(userId)) return false;
      if (activa !== undefined && r.activa !== activa) return false;
      return true;
    });
  }
}
