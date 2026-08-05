export function sendSuccess(res, { data = undefined, statusCode = 200, meta = undefined } = {}) {
  const payload = { success: true, timestamp: new Date().toISOString() };
  if (data !== undefined) payload.data = data;
  if (meta !== undefined) payload.meta = meta;
  return res.status(statusCode).json(payload);
}

export function sendNoContent(res) {
  return res.status(204).send();
}

export function sendPaginationResponse(res, items, { page, limit, statusCode = 200 } = {}) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const paginated = items.slice((page - 1) * limit, page * limit);
  const meta = {
    pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 },
  };
  return sendSuccess(res, { data: paginated, statusCode, meta });
}
