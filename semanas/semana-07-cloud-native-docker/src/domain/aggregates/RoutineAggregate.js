/**
 * AGGREGATE: RoutineAggregate
 *
 * Un Aggregate es la raíz de un grupo de entidades relacionadas.
 * Toda operación sobre las rutinas de un usuario pasa por aquí.
 * El Aggregate garantiza que las reglas de negocio siempre se cumplan.
 *
 * Regla de negocio central (invariante):
 *   Un usuario puede tener MÁXIMO UNA rutina activa a la vez.
 *   Si activas una, las demás se desactivan automáticamente.
 *
 * Genera "domain events" — objetos que describen qué pasó.
 * La capa de aplicación los lee y decide qué hacer (notificar, auditar, etc.)
 *
 * En arquitectura hexagonal:
 * - El Aggregate NO conoce repositorios ni HTTP
 * - Solo trabaja con datos en memoria
 * - Es 100% testeable sin dependencias externas
 */
export class RoutineAggregate {
  /**
   * @param {number} userId - el usuario dueño de estas rutinas
   * @param {Array} routines - lista de rutinas actuales del usuario
   */
  constructor(userId, routines = []) {
    this.userId = userId;
    // Copia defensiva — el aggregate controla su propio estado
    this.routines = [...routines];
    // Eventos generados durante esta operación (se vacían después de procesarlos)
    this.domainEvents = [];
  }

  /**
   * Crea una nueva rutina para este usuario.
   * Si activa=true, desactiva todas las demás primero (invariante).
   *
   * @param {{ id: number, nombre: string, descripcion: string, activa: boolean }} data
   * @returns {{ id, userId, nombre, descripcion, activa, fechaCreacion, ultimaActualizacion }}
   */
  createRoutine({ id, nombre, descripcion = '', activa = false }) {
    if (!nombre || String(nombre).trim() === '') {
      throw new Error('El nombre de la rutina es obligatorio');
    }

    // Aplicar invariante: máximo 1 activa
    if (activa) {
      this._deactivateAll();
    }

    const routine = {
      id,
      userId: this.userId,
      nombre: String(nombre).trim(),
      descripcion: String(descripcion),
      activa: Boolean(activa),
      fechaCreacion: new Date(),
      ultimaActualizacion: new Date(),
    };

    this.routines.push(routine);

    // Generar evento de dominio
    this.domainEvents.push({
      type: 'RoutineCreated',
      payload: { ...routine },
      occurredAt: new Date(),
    });

    return routine;
  }

  /**
   * Activa una rutina específica y desactiva las demás.
   * @param {number} routineId
   */
  activateRoutine(routineId) {
    const routine = this.routines.find((r) => r.id === routineId);
    if (!routine) throw new Error(`Rutina ${routineId} no encontrada en este aggregate`);

    // Aplicar invariante
    this._deactivateAll();
    routine.activa = true;
    routine.ultimaActualizacion = new Date();

    this.domainEvents.push({
      type: 'RoutineActivated',
      payload: { ...routine },
      occurredAt: new Date(),
    });

    return routine;
  }

  /**
   * Desactiva todas las rutinas del usuario.
   * Método privado — solo el aggregate lo llama internamente.
   */
  _deactivateAll() {
    this.routines.forEach((r) => {
      if (r.activa) {
        r.activa = false;
        r.ultimaActualizacion = new Date();
      }
    });
  }

  /**
   * Devuelve y vacía los eventos pendientes.
   * El use case los lee después de ejecutar la operación.
   */
  pullEvents() {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }
}
