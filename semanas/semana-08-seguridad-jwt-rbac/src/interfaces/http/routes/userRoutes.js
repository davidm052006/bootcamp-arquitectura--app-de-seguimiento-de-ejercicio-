import express from 'express';
export function createUserRoutes(c) {
  const r = express.Router();
  r.get('/', c.list); r.post('/', c.create); r.get('/:id', c.getById);
  return r;
}
