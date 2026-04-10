import { INotificationService } from '../../domain/ports/secondary/INotificationService.js';

/**
 * ADAPTADOR: ConsoleNotificationService
 *
 * Implementa INotificationService enviando notificaciones a la consola.
 * En producción, reemplazarías esto con PushNotificationService, EmailService, etc.
 * El dominio y la aplicación no cambian — solo cambias el adaptador.
 */
export class ConsoleNotificationService extends INotificationService {
  async notify(userId, message, type = 'info') {
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    console.log(`[NOTIF] ${icons[type] ?? 'ℹ️'} Usuario ${userId}: ${message}`);
  }
}
