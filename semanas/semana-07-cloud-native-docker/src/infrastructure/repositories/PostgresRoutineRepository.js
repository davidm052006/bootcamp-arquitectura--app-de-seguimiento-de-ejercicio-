import { IRoutineRepository } from '../../domain/ports/secondary/IRoutineRepository.js';
import { pool } from '../db/pool.js';

/**
 * ADAPTADOR PostgreSQL: RoutineRepository
 * Implementa IRoutineRepository usando PostgreSQL.
 */
export class PostgresRoutineRepository extends IRoutineRepository {
  async save(routine) {
    const { rows } = await pool.query(
      `INSERT INTO routines (user_id, nombre, descripcion, activa)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, nombre, descripcion, activa, fecha_creacion, ultima_actualizacion`,
      [routine.userId, routine.nombre, routine.descripcion ?? '', routine.activa ?? false]
    );
    return this.#mapRow(rows[0]);
  }

  async findById(id) {
    const { rows } = await pool.query('SELECT * FROM routines WHERE id = $1', [id]);
    return rows[0] ? this.#mapRow(rows[0]) : null;
  }

  async findAll() {
    const { rows } = await pool.query('SELECT * FROM routines ORDER BY id');
    return rows.map(this.#mapRow);
  }

  async findByUserId(userId) {
    const { rows } = await pool.query('SELECT * FROM routines WHERE user_id = $1 ORDER BY id', [userId]);
    return rows.map(this.#mapRow);
  }

  async update(id, data) {
    const { rows } = await pool.query(
      `UPDATE routines
       SET nombre = COALESCE($1, nombre),
           descripcion = COALESCE($2, descripcion),
           activa = COALESCE($3, activa),
           ultima_actualizacion = NOW()
       WHERE id = $4
       RETURNING id, user_id, nombre, descripcion, activa, fecha_creacion, ultima_actualizacion`,
      [data.nombre, data.descripcion, data.activa, id]
    );
    return rows[0] ? this.#mapRow(rows[0]) : null;
  }

  async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM routines WHERE id = $1', [id]);
    return rowCount > 0;
  }

  async deactivateAllForUser(userId, exceptRoutineId = null) {
    if (exceptRoutineId !== null) {
      await pool.query(
        'UPDATE routines SET activa = false, ultima_actualizacion = NOW() WHERE user_id = $1 AND id != $2',
        [userId, exceptRoutineId]
      );
    } else {
      await pool.query(
        'UPDATE routines SET activa = false, ultima_actualizacion = NOW() WHERE user_id = $1',
        [userId]
      );
    }
  }

  #mapRow(row) {
    return {
      id: row.id,
      userId: row.user_id,
      nombre: row.nombre,
      descripcion: row.descripcion,
      activa: row.activa,
      fechaCreacion: row.fecha_creacion,
      ultimaActualizacion: row.ultima_actualizacion,
    };
  }
}
