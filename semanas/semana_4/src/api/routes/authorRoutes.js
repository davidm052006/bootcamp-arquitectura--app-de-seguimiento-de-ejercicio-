import express from 'express';

/**
 * Configuración de rutas para Autores
 */
export function createAuthorRoutes(authorController) {
  const router = express.Router();

  // GET /api/authors - Listar todos los autores
  router.get('/', (req, res) => authorController.getAll(req, res));

  // GET /api/authors/:id - Obtener un autor específico
  router.get('/:id', (req, res) => authorController.getById(req, res));

  // POST /api/authors - Crear un nuevo autor
  router.post('/', (req, res) => authorController.create(req, res));

  // PUT /api/authors/:id - Actualizar un autor
  router.put('/:id', (req, res) => authorController.update(req, res));

  // DELETE /api/authors/:id - Eliminar un autor
  router.delete('/:id', (req, res) => authorController.delete(req, res));

  return router;
}
