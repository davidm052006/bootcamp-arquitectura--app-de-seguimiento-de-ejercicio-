export class UpdateRoutineUseCase {
  constructor(routineRepository, userRepository, domainService, notificationService) {
    this.routineRepository = routineRepository; this.userRepository = userRepository;
    this.domainService = domainService; this.notificationService = notificationService;
  }
  async execute(id, data) {
    const existing = await this.routineRepository.findById(id);
    if (!existing) throw new Error('Rutina no encontrada');
    if (data.userId !== undefined && Number(data.userId) !== existing.userId)
      throw new Error('No se permite cambiar el userId de una rutina');
    if (data.activa === true) {
      const userRoutines = await this.routineRepository.findByUserId(existing.userId);
      this.domainService.validateActivation(userRoutines, id);
      await this.routineRepository.deactivateAllForUser(existing.userId, id);
    }
    const updated = await this.routineRepository.update(id, {
      nombre: data.nombre !== undefined ? String(data.nombre).trim() : existing.nombre,
      descripcion: data.descripcion !== undefined ? String(data.descripcion) : existing.descripcion,
      activa: data.activa !== undefined ? Boolean(data.activa) : existing.activa,
      ultimaActualizacion: new Date(),
    });
    if (data.activa === true)
      await this.notificationService.notify(existing.userId, `Tu rutina "${updated.nombre}" está activa.`, 'success');
    return updated;
  }
}
