export class RoutineController {
  constructor(createUC, updateUC, getUC, deleteUC) {
    this.createUC = createUC; this.updateUC = updateUC;
    this.getUC = getUC;       this.deleteUC = deleteUC;
  }

  list = async (req, res, next) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const activa = req.query.active !== undefined ? req.query.active === 'true' : undefined;
      const data = await this.getUC.list({ userId, activa });
      res.json({ success: true, data, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const data = await this.getUC.getById(Number(req.params.id));
      res.json({ success: true, data, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  create = async (req, res, next) => {
    try {
      const data = await this.createUC.execute(req.body ?? {});
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
