/**
 * APP.JS — Express con seguridad completa (Semana 08)
 *
 * Hardening aplicado:
 *   - Helmet: headers HTTP seguros (X-Frame-Options, CSP, etc.)
 *   - CORS: solo orígenes permitidos
 *   - Rate limiting: estricto en /auth, general en /api
 *   - Límite de tamaño de body: evita ataques de payload gigante
 *   - Validación de input con Zod
 *   - JWT en todas las rutas protegidas
 *   - RBAC: roles user/admin
 */
import express from 'express';
import helmet  from 'helmet';
import cors    from 'cors';

import { authLimiter, apiLimiter } from './infrastructure/security/rateLimiter.js';
import { errorHandler }            from './interfaces/http/middleware/error-handler.js';

// Infraestructura
import { InMemoryUserRepository }    from './infrastructure/repositories/InMemoryUserRepository.js';
import { InMemoryRoutineRepository } from './infrastructure/repositories/InMemoryRoutineRepository.js';
import { ConsoleNotificationService } from './infrastructure/notifications/ConsoleNotificationService.js';
import { PasswordService }           from './infrastructure/security/PasswordService.js';
import { TokenService }              from './infrastructure/security/TokenService.js';

// Dominio
import { RoutineDomainService } from './domain/services/RoutineDomainService.js';

// Use cases
import { RegisterUserUseCase } from './application/use-cases/RegisterUserUseCase.js';
import { LoginUserUseCase }    from './application/use-cases/LoginUserUseCase.js';
import { CreateRoutineUseCase } from './application/use-cases/CreateRoutineUseCase.js';
import { UpdateRoutineUseCase } from './application/use-cases/UpdateRoutineUseCase.js';
import { GetRoutineUseCase }    from './application/use-cases/GetRoutineUseCase.js';

// Controladores y rutas
import { AuthController }    from './interfaces/http/controllers/AuthController.js';
import { RoutineController } from './interfaces/http/controllers/RoutineController.js';
import { createAuthRoutes }    from './interfaces/http/routes/authRoutes.js';
import { createRoutineRoutes } from './interfaces/http/routes/routineRoutes.js';

// ── Ensamblar dependencias ────────────────────────────────────────────────────
const userRepo      = new InMemoryUserRepository();
const routineRepo   = new InMemoryRoutineRepository();
const notifSvc      = new ConsoleNotificationService();
const passwordSvc   = new PasswordService();
const tokenSvc      = new TokenService();
const domainSvc     = new RoutineDomainService();

const registerUC    = new RegisterUserUseCase(userRepo, passwordSvc);
const loginUC       = new LoginUserUseCase(userRepo, passwordSvc, tokenSvc);
const createRoutineUC = new CreateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);
const updateRoutineUC = new UpdateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);
const getRoutineUC    = new GetRoutineUseCase(routineRepo);
const deleteRoutineFn = async (id) => {
  const e = await routineRepo.findById(id);
  if (!e) throw new Error('Rutina no encontrada');
  await routineRepo.delete(id);
};

const authCtrl    = new AuthController(registerUC, loginUC);
const routineCtrl = new RoutineController(createRoutineUC, updateRoutineUC, getRoutineUC, deleteRoutineFn);

// ── Express ───────────────────────────────────────────────────────────────────
const app = express();

// ── HARDENING ─────────────────────────────────────────────────────────────────

// 1. Helmet — agrega headers de seguridad HTTP automáticamente
//    X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, etc.
app.use(helmet());

// 2. CORS — solo permite orígenes configurados en .env
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(',');
app.use(cors({
  origin: (origin, cb) => {
    // Permitir requests sin origin (Postman, curl, tests)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error('Origen no permitido por CORS'));
  },
  credentials: true,
}));

// 3. Límite de tamaño de body — evita ataques de payload gigante (OWASP A05)
app.use(express.json({ limit: '10kb' }));

// 4. Logs estructurados
app.use((req, _res, next) => {
  console.log(JSON.stringify({ method: req.method, url: req.url, timestamp: new Date().toISOString() }));
  next();
});

// ── Rutas ─────────────────────────────────────────────────────────────────────

// Rate limit estricto en /auth (10 req / 15min)
app.use('/auth', authLimiter, createAuthRoutes(authCtrl));

// Rate limit general en /api (100 req / 15min)
app.use('/api/v1/routines', apiLimiter, createRoutineRoutes(routineCtrl));

app.get('/', (_req, res) => res.json({
  app: 'FitWell API',
  version: '5.0.0',
  semana: '08 — Seguridad (JWT + RBAC + OWASP)',
  endpoints: { register: 'POST /auth/register', login: 'POST /auth/login', routines: '/api/v1/routines' },
}));

app.get('/health', (_req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.use((_req, _res, next) => next(Object.assign(new Error('Ruta no encontrada'), { statusCode: 404 })));
app.use(errorHandler);

export { app };
