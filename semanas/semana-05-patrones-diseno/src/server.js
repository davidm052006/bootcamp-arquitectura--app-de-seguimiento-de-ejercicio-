import express from 'express';

// ✅ SINGLETON: configuración centralizada
import { AppConfig } from './patterns/singleton/AppConfig.js';

// ✅ OBSERVER: EventBus + observers
import { EventBus } from './patterns/observer/EventBus.js';
import { AuditObserver } from './patterns/observer/AuditObserver.js';
import { NotificationObserver } from './patterns/observer/NotificationObserver.js';

// ✅ DECORATOR: repositorios con logging
import { LoggingRepositoryDecorator } from './patterns/decorator/LoggingRepositoryDecorator.js';

import { ApiError } from './utils/api-error.js';
import { errorHandler } from './middleware/error-handler.js';

import { UserRepository } from './domain/repositories/UserRepository.js';
import { RoutineRepository } from './domain/repositories/RoutineRepository.js';
import { UserService } from './domain/services/UserService.js';
import { RoutineService } from './domain/services/RoutineService.js';
import { UserController } from './api/controllers/UserController.js';
import { RoutineController } from './api/controllers/RoutineController.js';
import { createUserRoutes } from './api/routes/userRoutes.js';
import { createRoutineRoutes } from './api/routes/routineRoutes.js';

// ─── 1. SINGLETON: obtener configuración única ───────────────────────────────
const config = AppConfig.getInstance();

// ─── 2. OBSERVER: crear bus y suscribir observers ────────────────────────────
const eventBus = new EventBus();
const auditObserver = new AuditObserver();
const notificationObserver = new NotificationObserver();

eventBus.on('routine.created',   (data) => auditObserver.handle(data));
eventBus.on('routine.created',   (data) => notificationObserver.handle(data));
eventBus.on('routine.activated', (data) => auditObserver.handle(data));
eventBus.on('routine.activated', (data) => notificationObserver.handle(data));
eventBus.on('routine.deleted',   (data) => auditObserver.handle(data));
eventBus.on('routine.deleted',   (data) => notificationObserver.handle(data));

// ─── 3. DECORATOR: repositorios con logging ──────────────────────────────────
const userRepository    = new LoggingRepositoryDecorator(new UserRepository(),    'UserRepo');
const routineRepository = new LoggingRepositoryDecorator(new RoutineRepository(), 'RoutineRepo');

// ─── 4. Servicios (reciben eventBus por DIP) ─────────────────────────────────
const userService    = new UserService(userRepository);
const routineService = new RoutineService(routineRepository, userRepository, eventBus);

// ─── 5. Controladores (usan Strategy internamente) ───────────────────────────
const userController    = new UserController(userService, routineService);
const routineController = new RoutineController(routineService);

// ─── 6. Express ──────────────────────────────────────────────────────────────
const app = express();
app.use(express.json());
app.use((req, res, next) => { console.log(`${req.method} ${req.url}`); next(); });

app.use(`${config.apiPrefix}/users`,    createUserRoutes(userController));
app.use(`${config.apiPrefix}/routines`, createRoutineRoutes(routineController));

app.get('/', (req, res) => {
  res.json({
    message: `${config.appName} — Semana 05: Patrones de Diseño`,
    version: config.appVersion,
    patrones: ['Singleton', 'Factory Method', 'Observer', 'Strategy', 'Decorator'],
    endpoints: {
      users: `${config.apiPrefix}/users`,
      routines: `${config.apiPrefix}/routines`,
    },
  });
});

app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.use((req, res, next) => next(new ApiError('Ruta no encontrada', 404)));
app.use(errorHandler);

app.listen(config.port, () => {
  console.log('===========================================');
  console.log(`🚀 ${config.appName} v${config.appVersion}`);
  console.log(`📍 http://localhost:${config.port}`);
  console.log(`🎨 Patrones activos: Singleton | Factory | Observer | Strategy | Decorator`);
  console.log('===========================================');
});
