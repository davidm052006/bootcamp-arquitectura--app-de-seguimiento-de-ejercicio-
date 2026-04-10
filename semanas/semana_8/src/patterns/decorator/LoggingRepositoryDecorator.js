/**
 * PATRÓN: DECORATOR
 *
 * Problema: Para agregar logging a los repositorios (saber cuándo se guarda,
 * busca o elimina algo), la única opción era modificar UserRepository y
 * RoutineRepository directamente → viola OCP (abierto a extensión, cerrado a modificación).
 *
 * Solución: Un decorador que envuelve cualquier repositorio y agrega logging
 * de forma transparente. El repositorio original no se toca.
 * Se puede activar o desactivar el logging simplemente cambiando si se usa el decorador.
 *
 * Uso:
 *   const repo = new LoggingRepositoryDecorator(new RoutineRepository(), 'Routine');
 *   repo.create(...)   // loguea automáticamente
 *   repo.findById(...) // loguea automáticamente
 */
export class LoggingRepositoryDecorator {
  /**
   * @param {object} repository - el repositorio real a decorar
   * @param {string} name - nombre para identificar en los logs
   */
  constructor(repository, name = 'Repository') {
    this.repository = repository;
    this.name = name;
  }

  create(entity) {
    console.log(`[${this.name}] create() →`, JSON.stringify(entity));
    const result = this.repository.create(entity);
    console.log(`[${this.name}] create() ← id=${result.id}`);
    return result;
  }

  findById(id) {
    console.log(`[${this.name}] findById(${id})`);
    const result = this.repository.findById(id);
    console.log(`[${this.name}] findById(${id}) ←`, result ? `encontrado` : 'null');
    return result;
  }

  findAll() {
    const result = this.repository.findAll();
    console.log(`[${this.name}] findAll() ← ${result.length} items`);
    return result;
  }

  findByEmail(email) {
    const result = this.repository.findByEmail?.(email);
    console.log(`[${this.name}] findByEmail(${email}) ←`, result ? 'encontrado' : 'null');
    return result;
  }

  findByUserId(userId) {
    const result = this.repository.findByUserId?.(userId) ?? [];
    console.log(`[${this.name}] findByUserId(${userId}) ← ${result.length} items`);
    return result;
  }

  update(id, data) {
    console.log(`[${this.name}] update(${id})`);
    return this.repository.update(id, data);
  }

  delete(id) {
    console.log(`[${this.name}] delete(${id})`);
    return this.repository.delete(id);
  }

  // Delega métodos específicos de RoutineRepository
  deactivateAllForUser(userId, exceptRoutineId) {
    console.log(`[${this.name}] deactivateAllForUser(userId=${userId}, except=${exceptRoutineId})`);
    return this.repository.deactivateAllForUser?.(userId, exceptRoutineId);
  }
}
