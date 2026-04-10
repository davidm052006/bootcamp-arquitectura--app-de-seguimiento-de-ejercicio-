import express from 'express';
import { validate, registerSchema, loginSchema } from '../middleware/validate.js';

export function createAuthRoutes(authController) {
  const router = express.Router();
  // validate() verifica el body antes de llegar al controlador
  router.post('/register', validate(registerSchema), authController.register);
  router.post('/login',    validate(loginSchema),    authController.login);
  return router;
}
