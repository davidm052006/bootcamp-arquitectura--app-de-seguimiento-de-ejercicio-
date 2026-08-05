import express from 'express';

import { ApiError } from './utils/api-error.js';
import { errorHandler } from './middleware/error-handler.js';
import { setupSwagger } from './swagger.js';

// Repositorios
import { UserRepository } from './domain/repositories/UserRepository.js';
import { RoutineRepository } from './domain/repositories/RoutineRepository.js';

// Servicios
import { UserService } from './domain/services/UserService.js';
import { RoutineService } from './domain/services/RoutineService.js';

// Controladores
import { UserController } from './api/controllers/UserController.js';
import { RoutineController } from './api/controllers/RoutineController.js';

// Rutas
import { createUserRoutes } from './api/routes/userRoutes.js';
import { createRoutineRoutes } from './api/routes/routineRoutes.js';

/**
 * SERVIDOR EXPRESS - PUNTO DE ENTRADA
 * 
 * Este archivo:
 * 1. Crea la aplicación Express
 * 2. Configura middlewares (funciones que procesan requests)
 * 3. Inicializa repositorios, servicios y controladores
 * 4. Registra las rutas
 * 5. Inicia el servidor en un puerto
 */

// 1. Crear la aplicación Express
const app = express();
const PORT = 3000;

// 2. Configurar middlewares
app.use(express.json()); // Permite recibir JSON en el body de las peticiones

// Middleware para logging (ver qué peticiones llegan)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Continúa al siguiente middleware o ruta
});

// 3. Inicializar dependencias (Inyección de Dependencias)
const userRepository = new UserRepository();
const routineRepository = new RoutineRepository();

const userService = new UserService(userRepository);
const routineService = new RoutineService(routineRepository, userRepository);

const userController = new UserController(userService, routineService);
const routineController = new RoutineController(routineService);

// 4. Swagger UI
setupSwagger(app);

// 5. Registrar rutas
app.use('/api/v1/users', createUserRoutes(userController));
app.use('/api/v1/routines', createRoutineRoutes(routineController));

// Ruta raíz (bienvenida)
app.get('/', (req, res) => {
  res.json({
    message: 'API de Seguimiento de Ejercicios - Semana 04',
    version: '1.0.0',
    endpoints: {
      users: '/api/v1/users',
      routines: '/api/v1/routines',
      docs: '/api-docs',
    }
  });
});

// Ruta para verificar salud del servidor
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 404 -> error middleware centralizado
app.use((req, res, next) => {
  next(new ApiError('Ruta no encontrada', 404));
});

app.use(errorHandler);

// 5. Iniciar el servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 Servidor iniciado exitosamente');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   - GET    http://localhost:${PORT}/api/v1/users`);
  console.log(`   - POST   http://localhost:${PORT}/api/v1/users`);
  console.log(`   - GET    http://localhost:${PORT}/api/v1/routines`);
  console.log(`   - POST   http://localhost:${PORT}/api/v1/routines`);
  console.log(`   - Swagger http://localhost:${PORT}/api-docs`);
  console.log('=================================');
});

/**
 * EXPLICACIÓN DEL FLUJO:
 * 
 * 1. Cliente hace petición: GET http://localhost:3000/api/books
 * 2. Express recibe la petición
 * 3. Pasa por middlewares (express.json, logging)
 * 4. Busca la ruta que coincida: /api/books
 * 5. Ejecuta el controlador: bookController.getAll()
 * 6. El controlador llama al servicio: bookService.getAllBooks()
 * 7. El servicio usa el repositorio: bookRepository.findAll()
 * 8. Se devuelve la respuesta JSON al cliente
 * 
 * SEPARACIÓN DE RESPONSABILIDADES:
 * - Rutas: Definen URLs y métodos HTTP
 * - Controladores: Manejan HTTP (request/response)
 * - Servicios: Lógica de negocio
 * - Repositorios: Acceso a datos
 * - Entidades: Modelos de dominio
 */
