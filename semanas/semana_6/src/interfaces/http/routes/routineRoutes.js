import express from 'express';

export function createRoutineRoutes(controller) {
  const router = express.Router();
  router.get('/',     controller.list);
  router.post('/',    controller.create);
  router.get('/:id',  controller.getById);
  router.put('/:id',  controller.update);
  router.patch('/:id', controller.patch);
  router.delete('/:id', controller.delete);
  return router;
}
