/**
 * PUERTO SECUNDARIO: IRoutineRepository
 *
 * Define el contrato que cualquier implementación de repositorio de rutinas
 * debe cumplir. El dominio y la aplicación dependen de esta interfaz.
 *
 * Implementaciones posibles (todas cumplen este contrato):
 *   - InMemoryRoutineRepository  → para tests y desarrollo
 *   - PostgresRoutineRepository  → para producción
 *   - MongoRoutineRepository     → si cambias de BD
 *
 * El dominio NO sabe cuál se usa — eso lo decide la infraestructura.
 * Esto es la "inversión de dependencias" (DIP) llevada al extremo.
 */
export class IRoutineRepository {
  async save(routine)           { throw new Error('No implementado'); }
  async findById(id)            { throw new Error('No implementado'); }
  async findAll()               { throw new Error('No implementado'); }
  async findByUserId(userId)    { throw new Error('No implementado'); }
  async update(id, data)        { throw new Error('No implementado'); }
  async delete(id)              { throw new Error('No implementado'); }
  async deactivateAllForUser(userId, exceptId) { throw new Error('No implementado'); }
}
