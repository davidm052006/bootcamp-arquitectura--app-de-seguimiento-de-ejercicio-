import { IUserRepository } from '../../domain/ports/secondary/IUserRepository.js';
import { pool } from '../db/pool.js';

/**
 * ADAPTADOR PostgreSQL: UserRepository
 *
 * Implementa IUserRepository usando PostgreSQL.
 * El dominio y la aplicación no saben que esto existe —
 * solo conocen el puerto IUserRepository.
 *
 * Nota: guardamos el email como string en la BD.
 * El Value Object Email se reconstruye al leer.
 */
export class PostgresUserRepository extends IUserRepository {
  async save(user) {
    // toJSON() convierte el Value Object Email a string
    const data = typeof user.toJSON === 'function' ? user.toJSON() : user;
    const { rows } = await pool.query(
      `INSERT INTO users (nombre, email)
       VALUES ($1, $2)
       RETURNING id, nombre, email, fecha_creacion, ultima_actualizacion`,
      [data.nombre, data.email]
    );
    return this.#mapRow(rows[0]);
  }

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1', [id]
    );
    return rows[0] ? this.#mapRow(rows[0]) : null;
  }

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
    return rows.map(this.#mapRow);
  }

  async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE LOWER(email) = LOWER($1)', [email]
    );
    return rows[0] ? this.#mapRow(rows[0]) : null;
  }

  async update(id, data) {
    const { rows } = await pool.query(
      `UPDATE users SET nombre = COALESCE($1, nombre), email = COALESCE($2, email),
       ultima_actualizacion = NOW()
       WHERE id = $3
       RETURNING id, nombre, email, fecha_creacion, ultima_actualizacion`,
      [data.nombre, data.email, id]
    );
    return rows[0] ? this.#mapRow(rows[0]) : null;
  }

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return rowCount > 0;
  }

  // Convierte fila de BD a objeto plano compatible con la app
  #mapRow(row) {
    return {
      id: row.id,
      nombre: row.nombre,
      email: row.email,
      fechaCreacion: row.fecha_creacion,
      ultimaActualizacion: row.ultima_actualizacion,
      toJSON() { return { id: this.id, nombre: this.nombre, email: this.email, fechaCreacion: this.fechaCreacion, ultimaActualizacion: this.ultimaActualizacion }; },
    };
  }
}
