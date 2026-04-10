/**
 * USE CASE: UpdateRoutineUseCase
 *
 * Maneja la actualización de una rutina, incluyendo la activación.
 * Cuando activa=true, aplica la regla de negocio: desactivar las demás.
 *
 * Flujo:
 *   1. Cargar la rutina existente
 *   2. Si se activa, validar con domain service y desactivar las demás
 *   3. Actualizar y persistir
 *   4. Notificar si se activó
 */
export class UpdateRoutineUseCase {
  constructor(routineRepository, userRepository, domainService, notificationService) {
    this.routineRepository   = routineRepository;
    this.userRepository      = userRepository;
    this.domainService       = domainService;
    this.notificationService = notificationService;
  }

  /**
   * @param {number} id - id de la rutina a actualizar
   * @param {{ nombre?: string, descripcion?: string, activa?: boolean }} data
   */
  async execute(id, data) {
    // 1. Cargar la rutina
    const existing = await this.routineRepository.findById(id);
    if (!existing) throw new Error('Rutina no encontrada');

    // 2. No permitir cambiar el userId
    if (data.userId !== undefined && Number(data.userId) !== existing.userId) {
      throw new Error('No se permite cambiar el userId de una rutina');
    }

    // 3. Si se activa, aplicar regla de negocio
    if (data.activa === true) {
      const userRoutines = await this.routineRepository.findByUserId(existing.userId);
      // Validar con domain service (verifica que la rutina pertenece al usuario)
      this.domainService.validateActivation(userRoutines, id);
      // Desactivar las demás
      await this.routineRepository.deactivateAllForUser(existing.userId, id);
    }

    // 4. Actualizar y persistir
    const updated = await this.routineRepository.update(id, {
      nombre:      data.nombre      !== undefined ? String(data.nombre).trim() : existing.nombre,
      descripcion: data.descripcion !== undefined ? String(data.descripcion)   : existing.descripcion,
      activa:      data.activa      !== undefined ? Boolean(data.activa)       : existing.activa,
      ultimaActualizacion: new Date(),
    });

    // 5. Notificar si se activó
    if (data.activa === true) {
      await this.notificationService.notify(
        existing.userId,
        `Tu rutina "${updated.nombre}" está activa. ¡A entrenar!`,
        'success'
      );
    }

    return updated;
  }
}
