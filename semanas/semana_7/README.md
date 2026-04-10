# FitWell API — Semana 07: Cloud Native (Docker + 12-Factor)

**Dominio:** Sistema de seguimiento de ejercicios  
**Stack:** Node.js 20 + Express + PostgreSQL + Docker

---

## Levantar todo con un comando

```bash
# 1. Copiar configuración
cp .env.example .env

# 2. Levantar todo (BD + migraciones + API + pgAdmin)
docker compose up --build
```

La API estará en `http://localhost:3000`  
pgAdmin estará en `http://localhost:5050`

---

## Verificar que funciona

```bash
# Health check
curl http://localhost:3000/health

# Readiness (verifica conexión a BD)
curl http://localhost:3000/ready

# Endpoint principal
curl http://localhost:3000/
```

---

## Comandos útiles

```bash
# Ver logs en tiempo real
docker compose logs -f api

# Ver estado de los contenedores
docker compose ps

# Detener todo
docker compose down

# Detener y borrar volúmenes (borra la BD)
docker compose down -v

# Producción (2 réplicas, sin pgAdmin)
docker compose -f docker-compose.prod.yml up --build -d
```

---

## Tests (sin Docker, sin BD)

```bash
npm install
npm test
# 25 tests, 0 fallos, ~220ms
```

---

## Estructura

```
semana_7/
├── Dockerfile                    ← Multi-stage, node:20-alpine, usuario node
├── docker-compose.yml            ← Dev: API + PostgreSQL + pgAdmin + migraciones
├── docker-compose.prod.yml       ← Prod: 2 réplicas, sin pgAdmin
├── .env.example                  ← Variables requeridas (copiar a .env)
├── .gitignore                    ← .env NO va al repo
├── migrations/
│   ├── 001_create_users.sql      ← Idempotente (IF NOT EXISTS)
│   ├── 002_create_routines.sql   ← Índice único: 1 rutina activa por usuario
│   └── migrate.js                ← Script que ejecuta las migraciones
├── src/
│   ├── app.js                    ← Setup de Express (12-Factor: separado del server)
│   ├── server.js                 ← Arranque + graceful shutdown
│   ├── domain/                   ← Lógica pura, sin dependencias externas
│   ├── application/              ← Use cases
│   ├── infrastructure/
│   │   ├── db/pool.js            ← Pool PostgreSQL
│   │   ├── repositories/
│   │   │   ├── InMemoryUserRepository.js     ← Para tests
│   │   │   ├── InMemoryRoutineRepository.js  ← Para tests
│   │   │   ├── PostgresUserRepository.js     ← Para producción
│   │   │   └── PostgresRoutineRepository.js  ← Para producción
│   │   └── notifications/
│   └── interfaces/http/          ← Controladores y rutas
└── tests/
    ├── domain.test.js
    └── application.test.js
```

---

## Endpoints

| Método | Endpoint             | Descripción        |
| ------ | -------------------- | ------------------ |
| GET    | /health              | Health check       |
| GET    | /ready               | Readiness (BD)     |
| GET    | /api/v1/users        | Listar usuarios    |
| POST   | /api/v1/users        | Crear usuario      |
| GET    | /api/v1/users/:id    | Obtener usuario    |
| GET    | /api/v1/routines     | Listar rutinas     |
| POST   | /api/v1/routines     | Crear rutina       |
| GET    | /api/v1/routines/:id | Obtener rutina     |
| PUT    | /api/v1/routines/:id | Actualizar rutina  |
| PATCH  | /api/v1/routines/:id | Activar/desactivar |
| DELETE | /api/v1/routines/:id | Eliminar rutina    |

---

## 12-Factor aplicado

| Factor            | Implementación                                     |
| ----------------- | -------------------------------------------------- |
| Config            | Variables de entorno en `.env`                     |
| Logs              | JSON a stdout (`console.log`)                      |
| Procesos          | `app.js` (setup) separado de `server.js` (run)     |
| Graceful shutdown | SIGTERM/SIGINT cierran el servidor limpiamente     |
| Dev/prod parity   | Mismo Dockerfile, diferente compose                |
| Backing services  | PostgreSQL como recurso adjunto via `DATABASE_URL` |
