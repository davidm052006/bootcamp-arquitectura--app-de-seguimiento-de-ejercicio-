import { Email } from '../value-objects/Email.js';

/**
 * ENTIDAD: User — extendida con rol y passwordHash para semana 8
 *
 * El dominio NO conoce bcrypt ni JWT — solo guarda el hash como string opaco.
 * La lógica de hashing vive en infrastructure/security/PasswordService.
 *
 * Roles disponibles: 'user' | 'admin'
 */
export class User {
  constructor({ id, nombre, email, passwordHash = null, role = 'user' }) {
    if (!nombre || String(nombre).trim() === '') throw new Error('El nombre del usuario es obligatorio');
    this.id           = id;
    this.nombre       = String(nombre).trim();
    this.email        = email ? new Email(email) : null;
    this.passwordHash = passwordHash; // string opaco — el dominio no sabe qué algoritmo es
    this.role         = ['user', 'admin'].includes(role) ? role : 'user';
    this.fechaCreacion       = new Date();
    this.ultimaActualizacion = new Date();
  }

  update({ nombre, email }) {
    if (nombre !== undefined) {
      if (String(nombre).trim() === '') throw new Error('El nombre no puede estar vacío');
      this.nombre = String(nombre).trim();
    }
    if (email !== undefined) this.email = email ? new Email(email) : null;
    this.ultimaActualizacion = new Date();
  }

  // toJSON NO incluye passwordHash — nunca se expone en respuestas HTTP
  toJSON() {
    return {
      id: this.id, nombre: this.nombre,
      email: this.email?.value ?? null,
      role: this.role,
      fechaCreacion: this.fechaCreacion,
      ultimaActualizacion: this.ultimaActualizacion,
    };
  }
}
