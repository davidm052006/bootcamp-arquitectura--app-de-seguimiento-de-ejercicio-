/**
 * CONTROLADOR HTTP: RoutineController
 *
 * En arquitectura hexagonal, el controlador es un ADAPTADOR PRIMARIO.
 * Traduce peticiones HTTP → llamadas a use cases.
 * Traduce resultados de use cases → respuestas HTTP.
 *
 * El controlador NO contiene lógica de negocio.
 * Solo sabe de HTTP: parsear request, llamar use case, formatear response.
 */
export class RoutineController {
  /**
   * @param {import('../../../application/use-cases/CreateRoutineUseCase.js').CreateRoutineUseCase} createUC
   * @param {import('../../../application/use-cases/UpdateRoutineUseCase.js').UpdateRoutineUseCase} updateUC
   * @param {import('../../../application/use-cases/GetRoutineUseCase.js').GetRoutineUseCase} getUC
   */
  constructor(createUC, updateUC, getUC, deleteUC) {
    this.createUC = createUC;
    this.updateUC = updateUC;
    this.getUC    = getUC;
    this.deleteUC = deleteUC;
  }

  list = async (req, res, next) => {
    try {
      const userId = req.query.userId ? Number(req.query.userId) : undefined;
      const activa = req.query.active !== undefined
        ? req.query.active === 'true'
        : undefined;
      const routines = await this.getUC.list({ userId, activa });
      res.json({ success: true, data: routines, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const routine = await this.getUC.getById(Number(req.params.id));
      res.json({ success: true, data: routine, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  create = async (req, res, next) => {
    try {
      const routine = await this.createUC.execute(req.body ?? {});
      res.status(201).json({ success: true, data: routine, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  update = async (req, res, next) => {
    try {
      const routine = await this.updateUC.execute(Number(req.params.id), req.body ?? {});
      res.json({ success: true, data: routine, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  patch = async (req, res, next) => {
    try {
      const routine = await this.updateUC.execute(Number(req.params.id), req.body ?? {});
      res.json({ success: true, data: routine, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  delete = async (req, res, next) => {
    try {
      await this.deleteUC(Number(req.params.id));
      res.status(204).send();
    } catch (err) { next(err); }
  };
}
