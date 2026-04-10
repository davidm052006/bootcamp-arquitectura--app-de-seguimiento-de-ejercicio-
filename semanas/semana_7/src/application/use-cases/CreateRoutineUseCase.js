export class CreateRoutineUseCase {
  constructor(routineRepository, userRepository, domainService, notificationService) {
    this.routineRepository   = routineRepository;
    this.userRepository      = userRepository;
    this.domainService       = domainService;
    this.notificationService = notificationService;
  }

  async execute({ userId, nombre, descripcion = '', activa = false }) {
    this.domainService.validateCreation({ nombre, userId });
    const user = await this.userRepository.findById(Number(userId));
    if (!user) throw new Error('Usuario no encontrado');
    if (activa) await this.routineRepository.deactivateAllForUser(Number(userId), null);
    const routine = await this.routineRepository.save({
      id: null, userId: Number(userId),
      nombre: String(nombre).trim(), descripcion: String(descripcion),
      activa: Boolean(activa), fechaCreacion: new Date(), ultimaActualizacion: new Date(),
    });
    await this.notificationService.notify(userId, `Nueva rutina "${routine.nombre}" creada.`, 'success');
    return routine;
  }
}
