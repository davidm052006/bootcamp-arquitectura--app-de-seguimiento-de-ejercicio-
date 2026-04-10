/**
 * PATRÓN: OBSERVER (EventBus)
 *
 * Problema: Cuando se activa una rutina en RoutineService, solo ocurre una cosa:
 * desactivar las demás. Pero en el futuro querrías también notificar al usuario,
 * registrar en auditoría, actualizar estadísticas, etc.
 * Sin Observer, tendrías que modificar RoutineService cada vez → viola OCP.
 *
 * Solución: RoutineService emite eventos. Los observers se suscriben y reaccionan
 * de forma independiente. Agregar un nuevo observer no toca el servicio.
 *
 * Eventos disponibles:
 *   - routine.created   → cuando se crea una rutina
 *   - routine.activated → cuando una rutina se activa
 *   - routine.deleted   → cuando se elimina una rutina
 */
export class EventBus {
  constructor() {
    // Map de evento → array de handlers
    this.handlers = new Map();
  }

  /**
   * Suscribe un handler a un evento.
   * @param {string} event - nombre del evento
   * @param {Function} handler - función que recibe los datos del evento
   */
  on(event, handler) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(handler);
  }

  /**
   * Emite un evento y notifica a todos los handlers suscritos.
   * @param {string} event - nombre del evento
   * @param {*} data - datos del evento
   */
  emit(event, data) {
    const eventHandlers = this.handlers.get(event) ?? [];
    eventHandlers.forEach((handler) => {
      try {
        handler(data);
      } catch (err) {
        // Un observer que falla no debe romper el flujo principal
        console.error(`[EventBus] Error en handler de "${event}":`, err.message);
      }
    });
  }
}
