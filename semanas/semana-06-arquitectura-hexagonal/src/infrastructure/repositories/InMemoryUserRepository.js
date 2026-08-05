import { IUserRepository } from '../../domain/ports/secondary/IUserRepository.js';

/**
 * ADAPTADOR: InMemoryUserRepository
 *
 * Implementa el puerto IUserRepository usando un Map en memoria.
 * Es el adaptador que se usa en tests y desarrollo.
 *
 * En arquitectura hexagonal, este archivo vive en "infrastructure" porque
 * es un detalle de implementación — el dominio no sabe que existe.
 *
 * Para producción, crearías PostgresUserRepository que implementa
 * el mismo IUserRepository — sin tocar nada del dominio ni la aplicación.
 */
export class InMemoryUserRepository extends IUserRepository {
  constructor() {
    super();
    this.store = new Map(); // Map<id, User>
    this.nextId = 1;
  }

  async save(user) {
    // Si no tiene id, es nuevo — asignar id autoincremental
    if (!user.id) {
      user.id = this.nextId++;
    }
    this.store.set(user.id, user);
    return user;
  }

  async findById(id) {
    return this.store.get(Number(id)) ?? null;
  }

  async findAll() {
    return Array.from(this.store.values());
  }

  async findByEmail(email) {
    const normalized = String(email ?? '').trim().toLowerCase();
    if (!normalized) return null;
    return Array.from(this.store.values()).find(
      (u) => (u.email?.value ?? u.email ?? '').toLowerCase() === normalized
    ) ?? null;
  }

  async update(id, data) {
    const user = this.store.get(Number(id));
    if (!user) return null;
    // Llamar al método update de la entidad si existe, o asignar directamente
    if (typeof user.update === 'function') {
      user.update(data);
    } else {
      Object.assign(user, data);
    }
    return user;
  }

  async delete(id) {
    return this.store.delete(Number(id));
  }
}
