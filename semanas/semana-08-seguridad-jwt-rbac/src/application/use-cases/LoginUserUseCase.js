/**
 * USE CASE: LoginUserUseCase
 *
 * Autentica un usuario y devuelve un JWT.
 * Flujo:
 *   1. Buscar usuario por email
 *   2. Verificar contraseña con bcrypt
 *   3. Generar JWT con { userId, role }
 *   4. Devolver token + datos del usuario (sin hash)
 *
 * OWASP A07 — Mensajes genéricos:
 *   Si el email no existe O la contraseña es incorrecta,
 *   devolvemos el MISMO mensaje de error.
 *   Así un atacante no puede saber si el email existe o no.
 */
export class LoginUserUseCase {
  /**
   * @param {import('../../domain/ports/secondary/IUserRepository.js').IUserRepository} userRepository
   * @param {import('../../infrastructure/security/PasswordService.js').PasswordService} passwordService
   * @param {import('../../infrastructure/security/TokenService.js').TokenService} tokenService
   */
  constructor(userRepository, passwordService, tokenService) {
    this.userRepository  = userRepository;
    this.passwordService = passwordService;
    this.tokenService    = tokenService;
  }

  async execute({ email, password }) {
    if (!email || !password) throw new Error('Credenciales inválidas');

    // 1. Buscar usuario
    const user = await this.userRepository.findByEmail(String(email).trim().toLowerCase());

    // 2. Verificar contraseña — mismo error si no existe o si la pass es incorrecta
    const passwordHash = user?.passwordHash ?? null;
    const valid = await this.passwordService.verify(password, passwordHash);

    if (!user || !valid) {
      // Mensaje genérico — OWASP: no revelar si el email existe
      throw new Error('Credenciales inválidas');
    }

    // 3. Generar JWT
    const token = this.tokenService.sign({ userId: user.id, role: user.role });

    // 4. Devolver token + usuario (sin hash)
    const userData = typeof user.toJSON === 'function' ? user.toJSON() : { id: user.id, nombre: user.nombre, email: user.email?.value ?? user.email, role: user.role };
    return { token, user: userData };
  }
}
