/**
 * PUERTO SECUNDARIO: INotificationService
 *
 * Contrato para enviar notificaciones.
 * El dominio/aplicación no sabe si las notificaciones van por email,
 * push notification, SMS, o simplemente a consola.
 * Eso lo decide la infraestructura.
 */
export class INotificationService {
  /**
   * @param {string} userId - a quién notificar
   * @param {string} message - el mensaje
   * @param {string} type - tipo de notificación (info, success, warning)
   */
  async notify(userId, message, type = 'info') {
    throw new Error('No implementado');
  }
}
