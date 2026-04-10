/**
 * POOL DE CONEXIONES PostgreSQL
 *
 * 12-Factor: la configuración viene de variables de entorno, nunca hardcodeada.
 * El pool reutiliza conexiones — no abre una nueva por cada query.
 *
 * Variables requeridas (definidas en .env):
 *   DATABASE_URL=postgres://user:pass@host:5432/dbname
 *   o individualmente: PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE
 */
import pg from 'pg';
const { Pool } = pg;

// Creamos el pool una sola vez (Singleton implícito)
// Lee DATABASE_URL automáticamente si está definida, o las variables PG* individuales
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,                // máximo 10 conexiones simultáneas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Log de errores del pool (12-Factor: logs a stdout)
pool.on('error', (err) => {
  console.error('[DB] Error inesperado en cliente idle:', err.message);
});

/**
 * Verifica que la conexión a la BD funciona.
 * Usado en /ready (readiness probe).
 */
export async function checkDbConnection() {
  const client = await pool.connect();
  await client.query('SELECT 1');
  client.release();
}
