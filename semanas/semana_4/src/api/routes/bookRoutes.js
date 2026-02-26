import express from 'express';

/**
 * Configuración de rutas para Libros
 * 
 * CONCEPTO CLAVE: Las rutas conectan URLs con controladores
 * - Define qué URL responde a qué método HTTP
 * - Conecta cada ruta con un método del controlador
 */
export function createBookRoutes(bookController) {
  const router = express.Router();

  // GET /api/books - Listar todos los libros
  router.get('/', (req, res) => bookController.getAll(req, res));

  // GET /api/books/:id - Obtener un libro específico
  router.get('/:id', (req, res) => bookController.getById(req, res));

  // POST /api/books - Crear un nuevo libro
  router.post('/', (req, res) => bookController.create(req, res));

  // PUT /api/books/:id - Actualizar un libro
  router.put('/:id', (req, res) => bookController.update(req, res));

  // DELETE /api/books/:id - Eliminar un libro
  router.delete('/:id', (req, res) => bookController.delete(req, res));

  // GET /api/books/author/:authorId - Libros de un autor
  router.get('/author/:authorId', (req, res) => bookController.getByAuthor(req, res));

  return router;
}
