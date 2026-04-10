import express from 'express';

export function createUserRoutes(userController) {
  const router = express.Router();
  router.get('/', userController.listUsers);
  router.post('/', userController.createUser);
  router.get('/:id', userController.getUserById);
  router.put('/:id', userController.updateUser);
  router.delete('/:id', userController.deleteUser);
  router.get('/:id/routines', userController.listUserRoutines);
  return router;
}
