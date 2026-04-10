/**
 * DOMAIN SERVICE: RoutineDomainService
 *
 * Un Domain Service contiene lógica de negocio que NO pertenece a una sola entidad.
 * En este caso: la regla "máximo 1 rutina activa por usuario" involucra
 * a TODAS las rutinas del usuario, no solo a una.
 *
 * Diferencia con Application Service (use case):
 *   - Domain Service: lógica de negocio pura, sin repositorios ni HTTP
 *   - Application Service: orquesta — carga datos, llama domain service, persiste, notifica
 *
 * Este servicio trabaja con objetos en memoria — es 100% testeable sin BD.
 */
export class RoutineDomainService {
  /**
   * Valida que se puede activar una rutina.
   * Regla: un usuario puede tener máximo 1 rutina activa.
   *
   * @param {Array} userRoutines - todas las rutinas del usuario
   * @param {number} routineIdToActivate - la que se quiere activar
   * @returns {{ canActivate: boolean, routinesToDeactivate: Array }}
   */
  validateActivation(userRoutines, routineIdToActivate) {
    const target = userRoutines.find((r) => r.id === routineIdToActivate);
    if (!target) {
      throw new Error(`Rutina ${routineIdToActivate} no pertenece a este usuario`);
    }

    // Las rutinas que deben desactivarse (todas las activas excepto la target)
    const routinesToDeactivate = userRoutines.filter(
      (r) => r.activa && r.id !== routineIdToActivate
    );

    return { canActivate: true, routinesToDeactivate };
  }

  /**
   * Valida los datos para crear una rutina.
   * @param {{ nombre: string, userId: number }} data
   * @throws {Error} si los datos son inválidos
   */
  validateCreation({ nombre, userId }) {
    if (!nombre || String(nombre).trim() === '') {
      throw new Error('El nombre de la rutina es obligatorio');
    }
    if (!userId || isNaN(Number(userId))) {
      throw new Error('userId es requerido y debe ser numérico');
    }
  }
}
