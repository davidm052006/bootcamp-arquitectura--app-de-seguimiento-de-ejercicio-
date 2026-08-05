/**
 * USE CASE: RegisterUserUseCase
 *
 * Registra un nuevo usuario con contraseña hasheada.
 * Flujo:
 *   1. Validar que el email no esté duplicado
 *   2. Hashear la contraseña (via PasswordService — infraestructura)
 *   3. Crear la entidad User con el hash
 *   4. Persistir
 *   5. Devolver el usuario SIN el hash (toJSON lo omite)
 *
 * El dominio (User) no sabe nada de bcrypt — solo recibe el hash como string.
 */
import { User } from '../../domain/entities/User.js';

export class RegisterUserUseCase {
  /**
   * @param {import('../../domain/ports/secondary/IUserRepository.js').IUserRepository} userRepository
   * @param {import('../../infrastructure/security/PasswordService.js').PasswordService} passwordService
   */
  constructor(userRepository, passwordService) {
    this.userRepository  = userRepository;
    this.passwordService = passwordService;
  }

  async execute({ nombre, email, password, role = 'user' }) {
    // 1. Validar contraseña mínima (PasswordService lanza si < 8 chars)
    const passwordHash = await this.passwordService.hash(password);

    // 2. Crear entidad — valida nombre y email (Value Object)
    const user = new User({ id: null, nombre, email, passwordHash, role });

    // 3. Verificar email duplicado
    if (user.email) {
      const existing = await this.userRepository.findByEmail(user.email.value);
      if (existing) throw new Error('El email ya está registrado');
    }

    // 4. Persistir
    const saved = await this.userRepository.save(user);

    // 5. Devolver sin passwordHash (toJSON lo omite)
    return typeof saved.toJSON === 'function' ? saved.toJSON() : saved;
  }
}
