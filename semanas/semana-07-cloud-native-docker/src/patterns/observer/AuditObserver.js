/**
 * Observer de Auditoría
 * Registra en consola cada evento importante del sistema.
 * En producción, esto escribiría a una base de datos o servicio de logs.
 */
export class AuditObserver {
  handle(data) {
    console.log(`[AUDIT] ${new Date().toISOString()} | evento: ${data.event} | datos:`, JSON.stringify(data.payload));
  }
}
