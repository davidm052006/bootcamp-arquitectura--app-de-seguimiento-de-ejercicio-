import { ApiError } from '../../utils/api-error.js';
import { sendNoContent, sendSuccess } from '../../utils/http-response.js';
import { OffsetPaginationStrategy } from '../../patterns/strategy/OffsetPaginationStrategy.js';

function parseBooleanQuery(value) {
  if (value === undefined) return undefined;
  const s = String(value).toLowerCase().trim();
  if (['true', '1', 'yes'].includes(s)) return true;
  if (['false', '0', 'no'].includes(s)) return false;
  return undefined;
}

export class RoutineController {
  constructor(routineService) {
    this.routineService = routineService;
    // ✅ STRATEGY: inyectamos la estrategia de paginación
    this.paginationStrategy = new OffsetPaginationStrategy();
  }

  parseId(req) {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) throw new ApiError('id debe ser numérico', 400);
    return id;
  }

  listRoutines = async (req, res, next) => {
    try {
      const userIdRaw = req.query.userId;
      const userId = userIdRaw !== undefined ? parseInt(userIdRaw, 10) : undefined;
      if (userIdRaw !== undefined && (!Number.isFinite(userId) || userId <= 0)) {
        throw new ApiError('userId debe ser numérico', 400);
      }

      const activa = parseBooleanQuery(req.query.active ?? req.query.activa);
      if ((req.query.active !== undefined || req.query.activa !== undefined) && activa === undefined) {
        throw new ApiError('active/activa debe ser boolean', 400);
      }

      const items = this.routineService.listRoutines({ userId, activa }).map((r) => r.toJSON());

      // ✅ STRATEGY: delegamos la paginación a la estrategia
      const { data, meta } = this.paginationStrategy.paginate(items, req.query);
      return sendSuccess(res, { data, meta, statusCode: 200 });
    } catch (err) {
      return next(err);
    }
  };

  getRoutineById = async (req, res, next) => {
    try {
      const id = this.parseId(req);
      const routine = this.routineService.getRoutineById(id);
      return sendSuccess(res, { data: routine.toJSON(), statusCode: 200 });
    } catch (err) {
      return next(err);
    }
  };

  createRoutine = async (req, res, next) => {
    try {
      const created = this.routineService.createRoutine(req.body ?? {});
      return sendSuccess(res, { data: created.toJSON(), statusCode: 201 });
    } catch (err) {
      return next(err);
    }
  };

  updateRoutine = async (req, res, next) => {
    try {
      const id = this.parseId(req);
      const updated = this.routineService.updateRoutine(id, req.body ?? {});
      return sendSuccess(res, { data: updated.toJSON(), statusCode: 200 });
    } catch (err) {
      return next(err);
    }
  };

  patchRoutine = async (req, res, next) => {
    try {
      const id = this.parseId(req);
      const updated = this.routineService.updateRoutine(id, req.body ?? {});
      return sendSuccess(res, { data: updated.toJSON(), statusCode: 200 });
    } catch (err) {
      return next(err);
    }
  };

  deleteRoutine = async (req, res, next) => {
    try {
      const id = this.parseId(req);
      this.routineService.deleteRoutine(id);
      return sendNoContent(res);
    } catch (err) {
      return next(err);
    }
  };
}
