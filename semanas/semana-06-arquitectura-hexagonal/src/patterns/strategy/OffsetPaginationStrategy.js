import { PaginationStrategy } from './PaginationStrategy.js';
import { AppConfig } from '../singleton/AppConfig.js';

/**
 * Estrategia concreta: paginación por offset (page + limit).
 * Es la estrategia clásica: "dame la página 2 con 10 items".
 */
export class OffsetPaginationStrategy extends PaginationStrategy {
  paginate(items, params = {}) {
    const config = AppConfig.getInstance().pagination;

    const page  = Math.max(1, parseInt(params.page  ?? config.defaultPage,  10));
    const limit = Math.min(
      config.maxLimit,
      Math.max(1, parseInt(params.limit ?? config.defaultLimit, 10))
    );

    const total      = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const data       = items.slice((page - 1) * limit, page * limit);

    return {
      data,
      meta: {
        pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
      },
    };
  }
}
