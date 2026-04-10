export class UserController {
  constructor(createUserUC, userRepository) {
    this.createUserUC   = createUserUC;
    this.userRepository = userRepository;
  }

  list = async (req, res, next) => {
    try {
      const users = await this.userRepository.findAll();
      const data  = users.map((u) => (typeof u.toJSON === 'function' ? u.toJSON() : u));
      res.json({ success: true, data, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  getById = async (req, res, next) => {
    try {
      const user = await this.userRepository.findById(Number(req.params.id));
      if (!user) return res.status(404).json({ success: false, error: { message: 'Usuario no encontrado' } });
      res.json({ success: true, data: typeof user.toJSON === 'function' ? user.toJSON() : user, timestamp: new Date() });
    } catch (err) { next(err); }
  };

  create = async (req, res, next) => {
    try {
      const user = await this.createUserUC.execute(req.body ?? {});
      res.status(201).json({ success: true, data: typeof user.toJSON === 'function' ? user.toJSON() : user, timestamp: new Date() });
    } catch (err) { next(err); }
  };
}
