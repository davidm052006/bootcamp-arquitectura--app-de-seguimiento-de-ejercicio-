import { IUserRepository } from '../../domain/ports/secondary/IUserRepository.js';

export class InMemoryUserRepository extends IUserRepository {
  constructor() { super(); this.store = new Map(); this.nextId = 1; }
  async save(user) {
    if (!user.id) user.id = this.nextId++;
    this.store.set(user.id, user);
    return user;
  }
  async findById(id)       { return this.store.get(Number(id)) ?? null; }
  async findAll()          { return Array.from(this.store.values()); }
  async findByEmail(email) {
    const n = String(email ?? '').trim().toLowerCase();
    return Array.from(this.store.values()).find(
      (u) => (u.email?.value ?? u.email ?? '').toLowerCase() === n
    ) ?? null;
  }
  async update(id, data) {
    const u = this.store.get(Number(id));
    if (!u) return null;
    if (typeof u.update === 'function') u.update(data); else Object.assign(u, data);
    return u;
  }
  async delete(id) { return this.store.delete(Number(id)); }
}
