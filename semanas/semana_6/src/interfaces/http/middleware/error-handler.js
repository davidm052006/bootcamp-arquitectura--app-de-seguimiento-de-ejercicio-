export function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);
  const status = err.statusCode ?? (err.message.includes('no encontrad') ? 404 : 400);
  res.status(status).json({
    success: false,
    timestamp: new Date().toISOString(),
    error: { message: err.message, statusCode: status },
  });
}
