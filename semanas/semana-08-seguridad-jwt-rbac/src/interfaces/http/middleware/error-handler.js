export function errorHandler(err, req, res, next) {
  const status = err.statusCode ?? (err.message.includes('no encontrad') ? 404 : 400);
  console.error(JSON.stringify({ level: 'error', message: err.message, status, timestamp: new Date().toISOString() }));
  res.status(status).json({ success: false, error: { message: err.message, statusCode: status }, timestamp: new Date().toISOString() });
}
