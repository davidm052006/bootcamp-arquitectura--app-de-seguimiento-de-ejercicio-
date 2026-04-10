/**
 * USE CASE: CreateUserUseCase
 *
 * Crea un nuevo usuario validando que el email no esté duplicado.
 * Usa la entidad User (que valida el email via Value Object Email).
 */
import { User } from '../../domain/entities/User.js';

export class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute({ nombre, email }) {
    // La entidad User valida nombre y email (via Value Object) en su constructor
    // Si los datos son inválidos, el constructor lanza Error antes de llegar al repo
    const user = new User({ id: null, nombre, email });

    // Verificar email duplicado
    if (user.email) {
      const existing = await this.userRepository.findByEmail(user.email.value);
      if (existing) throw new Error('El email ya está registrado');
    }

    return await this.userRepository.save(user);
  }
}
