/**
 * SCRIPT DE MIGRACIONES
 *
 * Ejecuta todos los archivos .sql en orden.
 * Idempotente: se puede correr múltiples veces sin romper nada.
 * Usado por el servicio "migrate" en docker-compose.yml.
 */
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runMigrations() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    console.log('[migrate] Conectado a PostgreSQL');

    // Leer archivos .sql en orden alfabético
    const files = fs.readdirSync(__dirname)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
      console.log(`[migrate] Ejecutando ${file}...`);
      await client.query(sql);
      console.log(`[migrate] ✅ ${file} completado`);
    }

    console.log('[migrate] ✅ Todas las migraciones completadas');
  } catch (err) {
    console.error('[migrate] ❌ Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
