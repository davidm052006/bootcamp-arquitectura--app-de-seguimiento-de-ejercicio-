/**
 * APP.JS — Configuración de Express (12-Factor)
 *
 * 12-Factor separa la configuración de la aplicación del arranque del servidor.
 * app.js configura Express y sus rutas.
 * server.js arranca el servidor en un puerto.
 *
 * Esto permite:
 *   - Testear la app sin levantar un servidor real
 *   - Reutilizar la app en diferentes contextos (HTTP, HTTPS, tests)
 */
import express from 'express';
import { errorHandler } from './interfaces/http/middleware/error-handler.js';

// ── Infraestructura ───────────────────────────────────────────────────────────
// Selecciona repositorios según el entorno:
//   USE_POSTGRES=true → PostgreSQL (producción/docker)
//   USE_POSTGRES=false → InMemory (desarrollo local sin docker)
import { InMemoryUserRepository }    from './infrastructure/repositories/InMemoryUserRepository.js';
import { InMemoryRoutineRepository } from './infrastructure/repositories/InMemoryRoutineRepository.js';
import { PostgresUserRepository }    from './infrastructure/repositories/PostgresUserRepository.js';
import { PostgresRoutineRepository } from './infrastructure/repositories/PostgresRoutineRepository.js';
import { ConsoleNotificationService } from './infrastructure/notifications/ConsoleNotificationService.js';

// ── Dominio ───────────────────────────────────────────────────────────────────
import { RoutineDomainService } from './domain/services/RoutineDomainService.js';

// ── Use Cases ─────────────────────────────────────────────────────────────────
import { CreateRoutineUseCase } from './application/use-cases/CreateRoutineUseCase.js';
import { UpdateRoutineUseCase } from './application/use-cases/UpdateRoutineUseCase.js';
import { GetRoutineUseCase }    from './application/use-cases/GetRoutineUseCase.js';
import { CreateUserUseCase }    from './application/use-cases/CreateUserUseCase.js';

// ── Controladores y rutas ─────────────────────────────────────────────────────
import { RoutineController } from './interfaces/http/controllers/RoutineController.js';
import { UserController }    from './interfaces/http/controllers/UserController.js';
import { createRoutineRoutes } from './interfaces/http/routes/routineRoutes.js';
import { createUserRoutes }    from './interfaces/http/routes/userRoutes.js';

// ── Selección de adaptadores según entorno ────────────────────────────────────
const usePostgres = process.env.USE_POSTGRES === 'true';

const userRepository    = usePostgres ? new PostgresUserRepository()    : new InMemoryUserRepository();
const routineRepository = usePostgres ? new PostgresRoutineRepository() : new InMemoryRoutineRepository();
const notificationSvc   = new ConsoleNotificationService();
const domainSvc         = new RoutineDomainService();

// ── Ensamblar use cases ───────────────────────────────────────────────────────
const createRoutineUC = new CreateRoutineUseCase(routineRepository, userRepository, domainSvc, notificationSvc);
const updateRoutineUC = new UpdateRoutineUseCase(routineRepository, userRepository, domainSvc, notificationSvc);
const getRoutineUC    = new GetRoutineUseCase(routineRepository);
const createUserUC    = new CreateUserUseCase(userRepository);

const deleteRoutineFn = async (id) => {
  const exists = await routineRepository.findById(id);
  if (!exists) throw new Error('Rutina no encontrada');
  await routineRepository.delete(id);
};

// ── Controladores ─────────────────────────────────────────────────────────────
const routineCtrl = new RoutineController(createRoutineUC, updateRoutineUC, getRoutineUC, deleteRoutineFn);
const userCtrl    = new UserController(createUserUC, userRepository);

// ── Express app ───────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());

// 12-Factor: logs estructurados a stdout
app.use((req, _res, next) => {
  console.log(JSON.stringify({ method: req.method, url: req.url, timestamp: new Date().toISOString() }));
  next();
});

// Rutas de negocio
app.use('/api/v1/routines', createRoutineRoutes(routineCtrl));
app.use('/api/v1/users',    createUserRoutes(userCtrl));

// Ruta raíz
app.get('/', (_req, res) => res.json({
  app: 'FitWell API',
  version: process.env.APP_VERSION ?? '4.0.0',
  semana: '07 — Cloud Native (Docker + 12-Factor)',
  storage: usePostgres ? 'PostgreSQL' : 'InMemory',
}));

// Health check — responde OK si el proceso está vivo
app.get('/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Readiness probe — responde OK solo si la BD está disponible
app.get('/ready', async (_req, res) => {
  if (!usePostgres) return res.json({ status: 'ready', storage: 'memory' });
  try {
    const { checkDbConnection } = await import('./infrastructure/db/pool.js');
    await checkDbConnection();
    res.json({ status: 'ready', storage: 'postgres' });
  } catch (err) {
    res.status(503).json({ status: 'not ready', error: err.message });
  }
});

// 404 y error handler
app.use((_req, _res, next) => next(Object.assign(new Error('Ruta no encontrada'), { statusCode: 404 })));
app.use(errorHandler);

export { app };
