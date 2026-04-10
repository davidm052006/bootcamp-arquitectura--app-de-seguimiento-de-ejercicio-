import express from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize }    from '../middleware/authorize.js';

export function createRoutineRoutes(controller) {
  const router = express.Router();

  // Todas las rutas de rutinas requieren autenticación
  router.use(authenticate);

  router.get('/',      controller.list);                          // user + admin
  router.post('/',     controller.create);                        // user + admin
  router.get('/:id',   controller.getById);                       // user + admin
  router.put('/:id',   controller.update);                        // user + admin
  router.patch('/:id', controller.patch);                         // user + admin
  router.delete('/:id', authorize('admin'), controller.delete);   // solo admin

  return router;
}
