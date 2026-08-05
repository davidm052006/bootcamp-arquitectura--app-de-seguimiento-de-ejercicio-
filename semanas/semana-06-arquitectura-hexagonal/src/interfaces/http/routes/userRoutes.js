import express from 'express';

export function createUserRoutes(controller) {
  const router = express.Router();
  router.get('/',    controller.list);
  router.post('/',   controller.create);
  router.get('/:id', controller.getById);
  return router;
}
