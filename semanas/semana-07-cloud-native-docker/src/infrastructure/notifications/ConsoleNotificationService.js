import { INotificationService } from '../../domain/ports/secondary/INotificationService.js';

export class ConsoleNotificationService extends INotificationService {
  async notify(userId, message, type = 'info') {
    const icons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    // 12-Factor: logs a stdout, formato JSON para facilitar parsing
    console.log(JSON.stringify({ level: type, userId, message, timestamp: new Date().toISOString() }));
  }
}
