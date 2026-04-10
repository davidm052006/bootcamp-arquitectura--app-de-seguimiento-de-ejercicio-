export class RoutineDomainService {
  validateCreation({ nombre, userId }) {
    if (!nombre || String(nombre).trim() === '') throw new Error('El nombre de la rutina es obligatorio');
    if (!userId || isNaN(Number(userId))) throw new Error('userId es requerido y debe ser numérico');
  }

  validateActivation(userRoutines, routineIdToActivate) {
    const target = userRoutines.find((r) => r.id === routineIdToActivate);
    if (!target) throw new Error(`Rutina ${routineIdToActivate} no pertenece a este usuario`);
    const routinesToDeactivate = userRoutines.filter((r) => r.activa && r.id !== routineIdToActivate);
    return { canActivate: true, routinesToDeactivate };
  }
}
