/**
 * USE CASE: CreateRoutineUseCase
 *
 * Un use case (caso de uso) orquesta una operación de negocio completa.
 * Sigue siempre el mismo flujo:
 *   1. Cargar entidades necesarias (via repositorio)
 *   2. Validar reglas de negocio (via domain service)
 *   3. Ejecutar la lógica (via aggregate o entidad)
 *   4. Persistir el resultado (via repositorio)
 *   5. Notificar (via notification service)
 *   6. Devolver el resultado
 *
 * El use case NO conoce Express, HTTP, ni base de datos concreta.
 * Solo conoce los PUERTOS (interfaces) — la infraestructura real se inyecta.
 * Esto permite testearlo con mocks en memoria, sin servidor ni BD.
 */
export class CreateRoutineUseCase {
  /**
   * @param {import('../../domain/ports/secondary/IRoutineRepository.js').IRoutineRepository} routineRepository
   * @param {import('../../domain/ports/secondary/IUserRepository.js').IUserRepository} userRepository
   * @param {import('../../domain/services/RoutineDomainService.js').RoutineDomainService} domainService
   * @param {import('../../domain/ports/secondary/INotificationService.js').INotificationService} notificationService
   */
  constructor(routineRepository, userRepository, domainService, notificationService) {
    this.routineRepository   = routineRepository;
    this.userRepository      = userRepository;
    this.domainService       = domainService;
    this.notificationService = notificationService;
  }

  /**
   * @param {{ userId: number, nombre: string, descripcion?: string, activa?: boolean }} command
   * @returns {Promise<object>} la rutina creada
   */
  async execute({ userId, nombre, descripcion = '', activa = false }) {
    // 1. Validar datos con domain service
    this.domainService.validateCreation({ nombre, userId });

    // 2. Verificar que el usuario existe
    const user = await this.userRepository.findById(Number(userId));
    if (!user) throw new Error('Usuario no encontrado');

    // 3. Si activa=true, desactivar las demás rutinas del usuario
    if (activa) {
      await this.routineRepository.deactivateAllForUser(Number(userId), null);
    }

    // 4. Persistir la nueva rutina
    const routine = await this.routineRepository.save({
      id: null,
      userId: Number(userId),
      nombre: String(nombre).trim(),
      descripcion: String(descripcion),
      activa: Boolean(activa),
      fechaCreacion: new Date(),
      ultimaActualizacion: new Date(),
    });

    // 5. Notificar al usuario
    await this.notificationService.notify(
      userId,
      `Nueva rutina "${routine.nombre}" creada.`,
      'success'
    );

    return routine;
  }
}
