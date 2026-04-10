export class RoutineRepository {
  constructor() {
    this.routines = new Map();
    this.nextId = 1;
  }

  create(routine) {
    const id = this.nextId++;
    routine.id = id;
    this.routines.set(id, routine);
    return routine;
  }

  findById(id) { return this.routines.get(id) || null; }

  findAll() { return Array.from(this.routines.values()); }

  findByUserId(userId) { return this.findAll().filter((r) => r.userId === userId); }

  update(id, updatedData) {
    const routine = this.routines.get(id);
    if (!routine) return null;
    routine.update(updatedData);
    return routine;
  }

  delete(id) { return this.routines.delete(id); }

  deactivateAllForUser(userId, exceptRoutineId = null) {
    this.findByUserId(userId).forEach((r) => {
      if (exceptRoutineId !== null && r.id === exceptRoutineId) return;
      if (r.activa) r.setActiva(false);
    });
  }
}
