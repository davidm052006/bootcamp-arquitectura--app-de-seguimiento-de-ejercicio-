import { IRoutineRepository } from '../../domain/ports/secondary/IRoutineRepository.js';

export class InMemoryRoutineRepository extends IRoutineRepository {
  constructor() { super(); this.store = new Map(); this.nextId = 1; }

  async save(routine) {
    if (!routine.id) routine.id = this.nextId++;
    this.store.set(routine.id, { ...routine });
    return this.store.get(routine.id);
  }
  async findById(id)       { return this.store.get(Number(id)) ?? null; }
  async findAll()          { return Array.from(this.store.values()); }
  async findByUserId(uid)  { return Array.from(this.store.values()).filter((r) => r.userId === Number(uid)); }
  async update(id, data) {
    const r = this.store.get(Number(id));
    if (!r) return null;
    const updated = { ...r, ...data };
    this.store.set(Number(id), updated);
    return updated;
  }
  async delete(id) { return this.store.delete(Number(id)); }
  async deactivateAllForUser(userId, exceptId = null) {
    for (const [id, r] of this.store.entries()) {
      if (r.userId === Number(userId) && r.activa) {
        if (exceptId !== null && r.id === exceptId) continue;
        this.store.set(id, { ...r, activa: false, ultimaActualizacion: new Date() });
      }
    }
  }
}
