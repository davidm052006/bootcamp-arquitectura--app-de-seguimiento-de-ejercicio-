/**
 * SERVER.JS — Arranque del servidor (12-Factor)
 *
 * Solo responsabilidad: arrancar el servidor HTTP en el puerto configurado.
 * La app (rutas, middlewares, lógica) está en app.js.
 *
 * 12-Factor:
 *   - Puerto desde variable de entorno PORT
 *   - Graceful shutdown: cierra conexiones antes de terminar
 *   - Logs a stdout
 */
import { app } from './app.js';
import { pool } from './infrastructure/db/pool.js';

const PORT = parseInt(process.env.PORT ?? '3000', 10);

const server = app.listen(PORT, () => {
  console.log(JSON.stringify({
    level: 'info',
    message: 'Servidor iniciado',
    port: PORT,
    env: process.env.NODE_ENV ?? 'development',
    storage: process.env.USE_POSTGRES === 'true' ? 'postgres' : 'memory',
    timestamp: new Date().toISOString(),
  }));
});

/**
 * GRACEFUL SHUTDOWN
 *
 * Cuando Docker/Kubernetes envía SIGTERM (al hacer docker stop),
 * el proceso no muere abruptamente — termina las peticiones en curso
 * y cierra el pool de BD limpiamente.
 *
 * Sin esto, las peticiones en vuelo se cortan a la mitad.
 */
async function shutdown(signal) {
  console.log(JSON.stringify({ level: 'info', message: `Señal ${signal} recibida — cerrando servidor...` }));

  server.close(async () => {
    console.log(JSON.stringify({ level: 'info', message: 'Servidor HTTP cerrado' }));
    try {
      await pool.end(); // cierra el pool de PostgreSQL
      console.log(JSON.stringify({ level: 'info', message: 'Pool de BD cerrado' }));
    } catch (_) { /* InMemory no tiene pool, ignorar */ }
    process.exit(0);
  });

  // Si tarda más de 10s, forzar cierre
  setTimeout(() => {
    console.error(JSON.stringify({ level: 'error', message: 'Shutdown forzado por timeout' }));
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));
