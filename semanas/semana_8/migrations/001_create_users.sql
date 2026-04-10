-- MIGRACIÓN 001: Crear tabla users
-- Idempotente: IF NOT EXISTS garantiza que se puede correr múltiples veces sin error

CREATE TABLE IF NOT EXISTS users (
  id                   SERIAL PRIMARY KEY,
  nombre               VARCHAR(255) NOT NULL,
  email                VARCHAR(255) UNIQUE,
  fecha_creacion       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  ultima_actualizacion TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Índice para búsqueda por email (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (LOWER(email));
