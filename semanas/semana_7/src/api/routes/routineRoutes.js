import express from 'express';

export function createRoutineRoutes(routineController) {
  const router = express.Router();
  router.get('/', routineController.listRoutines);
  router.post('/', routineController.createRoutine);
  router.get('/:id', routineController.getRoutineById);
  router.put('/:id', routineController.updateRoutine);
  router.patch('/:id', routineController.patchRoutine);
  router.delete('/:id', routineController.deleteRoutine);
  return router;
}
