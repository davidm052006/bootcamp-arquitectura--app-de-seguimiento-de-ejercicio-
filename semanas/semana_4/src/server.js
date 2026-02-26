import express from 'express';

// Importar repositorios
import { AuthorRepository } from './domain/repositories/AuthorRepository.js';
import { BookRepository } from './domain/repositories/BookRepository.js';

// Importar servicios
import { AuthorService } from './domain/services/AuthorService.js';
import { BookService } from './domain/services/BookService.js';

// Importar controladores
import { AuthorController } from './api/controllers/AuthorController.js';
import { BookController } from './api/controllers/BookController.js';

// Importar rutas
import { createAuthorRoutes } from './api/routes/authorRoutes.js';
import { createBookRoutes } from './api/routes/bookRoutes.js';

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
// Repositorios (capa de datos)
const authorRepository = new AuthorRepository();
const bookRepository = new BookRepository();

// Servicios (lógica de negocio)
const authorService = new AuthorService(authorRepository);
const bookService = new BookService(bookRepository, authorRepository);

// Controladores (capa HTTP)
const authorController = new AuthorController(authorService);
const bookController = new BookController(bookService);

// 4. Registrar rutas
app.use('/api/authors', createAuthorRoutes(authorController));
app.use('/api/books', createBookRoutes(bookController));

// Ruta raíz (bienvenida)
app.get('/', (req, res) => {
  res.json({
    message: 'API de Librería - Semana 04',
    version: '1.0.0',
    endpoints: {
      authors: '/api/authors',
      books: '/api/books'
    }
  });
});

// Ruta para verificar salud del servidor
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Middleware para rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Ruta no encontrada'
  });
});

// 5. Iniciar el servidor
app.listen(PORT, () => {
  console.log('=================================');
  console.log('🚀 Servidor iniciado exitosamente');
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   - GET    http://localhost:${PORT}/api/authors`);
  console.log(`   - POST   http://localhost:${PORT}/api/authors`);
  console.log(`   - GET    http://localhost:${PORT}/api/books`);
  console.log(`   - POST   http://localhost:${PORT}/api/books`);
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
