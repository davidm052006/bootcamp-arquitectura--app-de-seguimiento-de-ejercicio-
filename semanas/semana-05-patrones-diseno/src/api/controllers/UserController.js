import { ApiError } from '../../utils/api-error.js';
import { sendNoContent, sendSuccess } from '../../utils/http-response.js';
import { OffsetPaginationStrategy } from '../../patterns/strategy/OffsetPaginationStrategy.js';

export class UserController {
  constructor(userService, routineService) {
    this.userService = userService;
    this.routineService = routineService;
    // ✅ STRATEGY: misma estrategia, sin duplicar código
    this.paginationStrategy = new OffsetPaginationStrategy();
  }

  parseId(req) {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) throw new ApiError('id debe ser numérico', 400);
    return id;
  }

  listUsers = async (req, res, next) => {
    try {
      const items = this.userService.listUsers().map((u) => u.toJSON());
      const { data, meta } = this.paginationStrategy.paginate(items, req.query);
      return sendSuccess(res, { data, meta, statusCode: 200 });
    } catch (err) {
      return next(err);
    }
  };

  getUserById = async (req, res, next) => {
    try {
      const id = this.parseId(req);
      const user = this.userService.getUserById(id);
      return sendSuccess(res, { data: user.toJSON(), statusCode: 200 });
    } catch (err) {
      return next(err);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const { nombre, email } = req.body ?? {};
      const created = this.userService.createUser({ nombre, email });
      return sendSuccess(res, { data: created.toJSON(), statusCode: 201 });
    } catch (err) {
      return next(err);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const id = this.parseId(req);
      const { nombre, email } = req.body ?? {};
      const updated = this.userService.updateUser(id, { nombre, email });
      return sendSuccess(res, { data: updated.toJSON(), statusCode: 200 });
    } catch (err) {
      return next(err);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const id = this.parseId(req);
      this.userService.deleteUser(id);
      return sendNoContent(res);
    } catch (err) {
      return next(err);
    }
  };

  listUserRoutines = async (req, res, next) => {
    try {
      const userId = parseInt(req.params.id, 10);
      if (!Number.isFinite(userId)) throw new ApiError('userId debe ser numérico', 400);
      this.userService.getUserById(userId);
      const items = this.routineService.listRoutines({ userId }).map((r) => r.toJSON());
      const { data, meta } = this.paginationStrategy.paginate(items, req.query);
      return sendSuccess(res, { data, meta, statusCode: 200 });
    } catch (err) {
      return next(err);
    }
  };
}
