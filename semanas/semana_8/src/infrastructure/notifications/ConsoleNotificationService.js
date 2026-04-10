export class ConsoleNotificationService {
  async notify(userId, message, type = 'info') {
    console.log(JSON.stringify({ level: type, userId, message, timestamp: new Date().toISOString() }));
  }
}
