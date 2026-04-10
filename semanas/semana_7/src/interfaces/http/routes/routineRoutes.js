import express from 'express';
export function createRoutineRoutes(c) {
  const r = express.Router();
  r.get('/', c.list); r.post('/', c.create);
  r.get('/:id', c.getById); r.put('/:id', c.update);
  r.patch('/:id', c.patch); r.delete('/:id', c.delete);
  return r;
}
