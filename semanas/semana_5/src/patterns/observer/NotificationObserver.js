/**
 * Observer de Notificaciones
 * Simula el envío de una notificación al usuario cuando su rutina cambia.
 * En producción, llamaría a un servicio de push notifications o email.
 */
export class NotificationObserver {
  handle(data) {
    const { event, payload } = data;

    if (event === 'routine.activated') {
      console.log(`[NOTIF] 📱 Notificación → Usuario ${payload.userId}: Tu rutina "${payload.nombre}" está activa. ¡A entrenar!`);
    }

    if (event === 'routine.created') {
      console.log(`[NOTIF] 📱 Notificación → Usuario ${payload.userId}: Nueva rutina "${payload.nombre}" creada.`);
    }

    if (event === 'routine.deleted') {
      console.log(`[NOTIF] 📱 Notificación → Usuario ${payload.userId}: Rutina "${payload.nombre}" eliminada.`);
    }
  }
}
