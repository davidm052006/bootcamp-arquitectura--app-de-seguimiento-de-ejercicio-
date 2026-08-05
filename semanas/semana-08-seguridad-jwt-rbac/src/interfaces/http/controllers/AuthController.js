/**
 * AuthController — Maneja registro y login
 *
 * Traduce HTTP → use cases → HTTP response.
 * No contiene lógica de negocio ni de seguridad.
 */
export class AuthController {
  constructor(registerUC, loginUC) {
    this.registerUC = registerUC;
    this.loginUC    = loginUC;
  }

  register = async (req, res, next) => {
    try {
      const user = await this.registerUC.execute(req.body);
      res.status(201).json({ success: true, data: user, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  login = async (req, res, next) => {
    try {
      const result = await this.loginUC.execute(req.body);
      res.json({ success: true, data: result, timestamp: new Date() });
    } catch (err) { next(err); }
  };
}
