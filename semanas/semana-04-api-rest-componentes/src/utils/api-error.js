export class ApiError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {object} [details]
   */
  constructor(message, statusCode = 500, details = undefined) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

