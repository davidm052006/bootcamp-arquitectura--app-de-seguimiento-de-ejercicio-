/**
 * SERVER — Punto de entrada de la aplicación
 *
 * Aquí se ensambla todo el hexágono:
 *   - Se crean los adaptadores de infraestructura (repositorios, notificaciones)
 *   - Se inyectan en los use cases (aplicación)
 *   - Los use cases se inyectan en los controladores (interfaces HTTP)
 *
 * Si mañana quieres usar PostgreSQL, solo cambias los adaptadores aquí.
 * El dominio y la aplicación no se tocan.
 *
 * Flujo de una petición:
 *   HTTP Request
 *     → RoutineController (interfaces/http)
 *       → CreateRoutineUseCase (application)
 *         → RoutineDomainService (domain)
 *         → InMemoryRoutineRepository (infrastructure)
 *         → ConsoleNotificationService (infrastructure)
 *     → HTTP Response
 */
import express from 'express';

// ── Infraestructura (adaptadores secundarios) ─────────────────────────────────
import { InMemoryUserRepository }    from './infrastructure/repositories/InMemoryUserRepository.js';
import { InMemoryRoutineRepository } from './infrastructure/repositories/InMemoryRoutineRepository.js';
import { ConsoleNotificationService } from './infrastructure/notifications/ConsoleNotificationService.js';

// ── Dominio ───────────────────────────────────────────────────────────────────
import { RoutineDomainService } from './domain/services/RoutineDomainService.js';

// ── Aplicación (use cases) ────────────────────────────────────────────────────
import { CreateRoutineUseCase } from './application/use-cases/CreateRoutineUseCase.js';
import { UpdateRoutineUseCase } from './application/use-cases/UpdateRoutineUseCase.js';
import { GetRoutineUseCase }    from './application/use-cases/GetRoutineUseCase.js';
import { CreateUserUseCase }    from './application/use-cases/CreateUserUseCase.js';

// ── Interfaces HTTP (adaptadores primarios) ───────────────────────────────────
import { RoutineController } from './interfaces/http/controllers/RoutineController.js';
import { UserController }    from './interfaces/http/controllers/UserController.js';
import { createRoutineRoutes } from './interfaces/http/routes/routineRoutes.js';
import { createUserRoutes }    from './interfaces/http/routes/userRoutes.js';
import { errorHandler }        from './interfaces/http/middleware/error-handler.js';

// ── Ensamblar el hexágono ─────────────────────────────────────────────────────

// 1. Adaptadores de infraestructura
const userRepository      = new InMemoryUserRepository();
const routineRepository   = new InMemoryRoutineRepository();
const notificationService = new ConsoleNotificationService();

// 2. Domain service
const routineDomainService = new RoutineDomainService();

// 3. Use cases — reciben puertos, no implementaciones concretas
const createRoutineUC = new CreateRoutineUseCase(routineRepository, userRepository, routineDomainService, notificationService);
const updateRoutineUC = new UpdateRoutineUseCase(routineRepository, userRepository, routineDomainService, notificationService);
const getRoutineUC    = new GetRoutineUseCase(routineRepository);
const createUserUC    = new CreateUserUseCase(userRepository);

// deleteRoutine como función simple (no necesita use case propio)
const deleteRoutineFn = async (id) => {
  const exists = await routineRepository.findById(id);
  if (!exists) throw new Error('Rutina no encontrada');
  await routineRepository.delete(id);
};

// 4. Controladores HTTP
const routineController = new RoutineController(createRoutineUC, updateRoutineUC, getRoutineUC, deleteRoutineFn);
const userController    = new UserController(createUserUC, userRepository);

// ── Express ───────────────────────────────────────────────────────────────────
const app  = express();
const PORT = 3000;

app.use(express.json());
app.use((req, _res, next) => { console.log(`${req.method} ${req.url}`); next(); });

app.use('/api/v1/routines', createRoutineRoutes(routineController));
app.use('/api/v1/users',    createUserRoutes(userController));

app.get('/', (_req, res) => res.json({
  app: 'FitWell API — Semana 06: Arquitectura Hexagonal',
  version: '3.0.0',
  arquitectura: 'Hexagonal (Ports & Adapters)',
  capas: ['domain', 'application', 'infrastructure', 'interfaces/http'],
}));

app.get('/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date() }));
app.use((_req, _res, next) => next(Object.assign(new Error('Ruta no encontrada'), { statusCode: 404 })));
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('===========================================');
  console.log('🚀 FitWell API v3.0.0 — Arquitectura Hexagonal');
  console.log(`📍 http://localhost:${PORT}`);
  console.log('🔷 Capas: domain | application | infrastructure | interfaces');
  console.log('===========================================');
});

export { app }; // exportado para tests
