-- MIGRACIÓN 002: Crear tabla routines
-- Idempotente: IF NOT EXISTS

CREATE TABLE IF NOT EXISTS routines (
  id                   SERIAL PRIMARY KEY,
  user_id              INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  nombre               VARCHAR(255) NOT NULL,
  descripcion          TEXT         NOT NULL DEFAULT '',
  activa               BOOLEAN      NOT NULL DEFAULT FALSE,
  fecha_creacion       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  ultima_actualizacion TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Índice para buscar rutinas por usuario
CREATE INDEX IF NOT EXISTS idx_routines_user_id ON routines (user_id);

-- Índice parcial: solo 1 rutina activa por usuario (constraint a nivel de BD)
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_routine_per_user
  ON routines (user_id)
  WHERE activa = TRUE;
