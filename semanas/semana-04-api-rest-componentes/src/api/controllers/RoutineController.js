import { ApiError } from '../../utils/api-error.js';
import { sendNoContent, sendPaginationResponse, sendSuccess } from '../../utils/http-response.js';

function parseBooleanQuery(value) {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  const s = String(value).toLowerCase().trim();
  if (['true', '1', 'yes'].includes(s)) return true;
  if (['false', '0', 'no'].includes(s)) return false;
  return undefined;
}

export class RoutineController {
  constructor(routineService) {
    this.routineService = routineService;
  }

  parseId(req) {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) throw new ApiError('id debe ser numérico', 400);
    return id;
  }

  listRoutines = async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10));
      const limit = Math.max(1, parseInt(req.query.limit ?? '10', 10));

      const userIdRaw = req.query.userId;
      const userId = userIdRaw !== undefined ? parseInt(userIdRaw, 10) : undefined;
      if (userIdRaw !== undefined && (!Number.isFinite(userId) || userId <= 0)) {
        throw new ApiError('userId debe ser numérico', 400);
      }

      const activa = parseBooleanQuery(req.query.active ?? req.query.activa);
      if (req.query.active !== undefined || req.query.activa !== undefined) {
        if (activa === undefined) throw new ApiError('active/activa debe ser boolean', 400);
      }

      const routines = this.routineService
        .listRoutines({ userId, activa })
        .map((r) => r.toJSON());

      return sendPaginationResponse(res, routines, { page, limit, statusCode: 200 });
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

