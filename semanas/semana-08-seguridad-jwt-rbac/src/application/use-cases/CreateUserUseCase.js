import { User } from '../../domain/entities/User.js';

export class CreateUserUseCase {
  constructor(userRepository) { this.userRepository = userRepository; }

  async execute({ nombre, email }) {
    const user = new User({ id: null, nombre, email });
    if (user.email) {
      const existing = await this.userRepository.findByEmail(user.email.value);
      if (existing) throw new Error('El email ya está registrado');
    }
    return await this.userRepository.save(user);
  }
}
