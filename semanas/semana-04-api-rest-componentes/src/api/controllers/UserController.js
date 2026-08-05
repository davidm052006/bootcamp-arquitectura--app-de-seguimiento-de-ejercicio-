import { ApiError } from '../../utils/api-error.js';
import { sendNoContent, sendPaginationResponse, sendSuccess } from '../../utils/http-response.js';

export class UserController {
  constructor(userService, routineService) {
    this.userService = userService;
    this.routineService = routineService;
  }

  parseId(req) {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) throw new ApiError('id debe ser numérico', 400);
    return id;
  }

  listUsers = async (req, res, next) => {
    try {
      const page = Math.max(1, parseInt(req.query.page ?? '1', 10));
      const limit = Math.max(1, parseInt(req.query.limit ?? '10', 10));

      const all = this.userService.listUsers().map((u) => u.toJSON());
      return sendPaginationResponse(res, all, { page, limit, statusCode: 200 });
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

      const page = Math.max(1, parseInt(req.query.page ?? '1', 10));
      const limit = Math.max(1, parseInt(req.query.limit ?? '10', 10));

      // Si el usuario no existe, que falle con 404:
      this.userService.getUserById(userId);

      const routines = this.routineService
        .listRoutines({ userId })
        .map((r) => r.toJSON());

      return sendPaginationResponse(res, routines, { page, limit, statusCode: 200 });
    } catch (err) {
      return next(err);
    }
  };
}

