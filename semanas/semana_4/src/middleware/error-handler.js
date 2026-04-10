import { ApiError } from '../utils/api-error.js';

export function errorHandler(err, req, res, next) {
  const isApiError = err instanceof ApiError;
  const statusCode = isApiError ? err.statusCode : 500;

  // eslint-disable-next-line no-console
  console.error('[errorHandler]', err);

  return res.status(statusCode).json({
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      message: err?.message || 'Internal Server Error',
      details: err?.details,
      statusCode,
    },
  });
}

