export class UserRepository {
  constructor() {
    this.users = new Map();
    this.nextId = 1;
  }

  create(user) {
    const id = this.nextId++;
    user.id = id;
    this.users.set(id, user);
    return user;
  }

  findById(id) { return this.users.get(id) || null; }

  findAll() { return Array.from(this.users.values()); }

  findByEmail(email) {
    const normalized = String(email ?? '').trim().toLowerCase();
    if (!normalized) return null;
    return this.findAll().find((u) => (u.email ?? '').toLowerCase() === normalized) ?? null;
  }

  update(id, updatedData) {
    const user = this.users.get(id);
    if (!user) return null;
    user.update(updatedData);
    return user;
  }

  delete(id) { return this.users.delete(id); }
}
