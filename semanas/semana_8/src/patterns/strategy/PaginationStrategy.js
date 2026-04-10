/**
 * PATRÓN: STRATEGY
 *
 * Problema: La lógica de paginación estaba duplicada en RoutineController
 * y UserController — el mismo bloque de código copy-paste en ambos.
 * Si querías cambiar cómo se pagina (ej: cursor-based en vez de offset),
 * tenías que modificar todos los controladores.
 *
 * Solución: Encapsular el algoritmo de paginación en una clase intercambiable.
 * Los controladores usan la estrategia sin saber cómo funciona internamente.
 * Hoy: OffsetPaginationStrategy. Mañana: CursorPaginationStrategy — sin tocar controladores.
 */

/**
 * Clase base (contrato) — define la interfaz que toda estrategia debe cumplir.
 */
export class PaginationStrategy {
  /**
   * @param {Array} items - todos los items sin paginar
   * @param {object} params - parámetros de paginación
   * @returns {{ data: Array, meta: object }}
   */
  paginate(items, params) {
    throw new Error('paginate() debe ser implementado por la estrategia concreta');
  }
}
