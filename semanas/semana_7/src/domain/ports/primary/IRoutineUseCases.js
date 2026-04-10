/**
 * PUERTO PRIMARIO: IRoutineUseCases
 *
 * En arquitectura hexagonal hay dos tipos de puertos:
 *
 * PUERTO PRIMARIO (driving port):
 *   Define CÓMO el mundo exterior puede usar el dominio.
 *   Lo implementan los use cases de la capa de aplicación.
 *   Lo llaman los controladores HTTP, CLI, tests, etc.
 *
 * PUERTO SECUNDARIO (driven port):
 *   Define CÓMO el dominio necesita que el mundo exterior le sirva.
 *   Lo implementan los repositorios, servicios de email, etc.
 *
 * Este archivo define el contrato que los use cases de rutinas deben cumplir.
 * Los controladores HTTP dependen de esta interfaz, no de la implementación concreta.
 */
export class IRoutineUseCases {
  /** @returns {Promise<object>} la rutina creada */
  async createRoutine(data) { throw new Error('No implementado'); }

  /** @returns {Promise<object>} la rutina actualizada */
  async updateRoutine(id, data) { throw new Error('No implementado'); }

  /** @returns {Promise<object>} la rutina encontrada */
  async getRoutineById(id) { throw new Error('No implementado'); }

  /** @returns {Promise<Array>} lista de rutinas */
  async listRoutines(filters) { throw new Error('No implementado'); }

  /** @returns {Promise<void>} */
  async deleteRoutine(id) { throw new Error('No implementado'); }
}
