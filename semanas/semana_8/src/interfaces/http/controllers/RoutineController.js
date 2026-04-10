export class RoutineController {
  constructor(createUC, updateUC, getUC, deleteUC) {
    this.createUC = createUC; this.updateUC = updateUC;
    this.getUC = getUC;       this.deleteUC = deleteUC;
  }

  list = async (req, res, next) => {
    try {
      // Un usuario normal solo ve SUS rutinas; admin ve todas
      const isAdmin = req.user?.role === 'admin';
      const userId = isAdmin
        ? (req.query.userId ? Number(req.query.userId) : undefined)
        : req.user.userId; // forzar filtro por userId del token
      const activa = req.query.active !== undefined ? req.query.active === 'true' : undefined;
      const data = await this.getUC.list({ userId, activa });
      res.json({ success: true, data, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const data = await this.getUC.getById(Number(req.params.id));
      // Un usuario solo puede ver sus propias rutinas
      if (req.user?.role !== 'admin' && data.userId !== req.user?.userId) {
        return res.status(403).json({ success: false, error: { message: 'No tienes permiso', statusCode: 403 } });
      }
      res.json({ success: true, data, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  create = async (req, res, next) => {
    try {
      // Forzar userId del token (no del body) para usuarios normales
      const userId = req.user?.role === 'admin' ? (req.body.userId ?? req.user.userId) : req.user.userId;
      const data = await this.createUC.execute({ ...req.body, userId });
      res.status(201).json({ success: true, data, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  update = async (req, res, next) => {
    try {
      const data = await this.updateUC.execute(Number(req.params.id), req.body ?? {});
      res.json({ success: true, data, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  patch = async (req, res, next) => {
    try {
      const data = await this.updateUC.execute(Number(req.params.id), req.body ?? {});
      res.json({ success: true, data, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  delete = async (req, res, next) => {
    try {
      await this.deleteUC(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  };
}
