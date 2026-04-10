import { ApiError } from '../../utils/api-error.js';
import { User } from '../entities/User.js';

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  createUser({ nombre, email }) {
    if (!nombre || String(nombre).trim() === '') {
      throw new ApiError('El nombre es obligatorio', 400);
    }
    const normalizedEmail = email !== undefined ? String(email).trim().toLowerCase() : undefined;
    if (normalizedEmail) {
      const existing = this.userRepository.findByEmail(normalizedEmail);
      if (existing) throw new ApiError('El email ya está registrado', 409, { field: 'email' });
    }
    const user = new User({ id: null, nombre: String(nombre).trim(), email: normalizedEmail });
    return this.userRepository.create(user);
  }

  getUserById(id) {
    const user = this.userRepository.findById(id);
    if (!user) throw new ApiError('Usuario no encontrado', 404);
    return user;
  }

  listUsers() { return this.userRepository.findAll(); }

  updateUser(id, updateData) {
    this.getUserById(id);
    return this.userRepository.update(id, updateData);
  }

  deleteUser(id) {
    this.getUserById(id);
    return this.userRepository.delete(id);
  }
}
