/**
 * MIDDLEWARE: authorize (RBAC — Role-Based Access Control)
 *
 * Verifica que el usuario autenticado tiene el rol requerido.
 * Se usa DESPUÉS de authenticate.
 *
 * Uso:
 *   router.delete('/:id', authenticate, authorize('admin'), controller.delete)
 *   // Solo admins pueden eliminar
 *
 *   router.get('/', authenticate, authorize('user', 'admin'), controller.list)
 *   // Cualquier usuario autenticado puede listar
 *
 * Si el rol no está permitido → 403 Forbidden (autenticado pero sin permiso)
 * Si no está autenticado → 401 (authenticate lo maneja antes)
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    // req.user lo pone el middleware authenticate
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'No autenticado', statusCode: 401 },
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'No tienes permiso para realizar esta acción', statusCode: 403 },
      });
    }

    next();
  };
}
