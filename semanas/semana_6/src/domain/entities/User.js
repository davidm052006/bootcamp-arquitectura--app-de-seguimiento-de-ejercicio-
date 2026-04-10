import { Email } from '../value-objects/Email.js';

/**
 * ENTIDAD: User
 *
 * Una entidad tiene identidad propia (id) y puede cambiar con el tiempo.
 * Contiene validaciones de sus propios datos y lógica de negocio básica.
 *
 * En arquitectura hexagonal, esta entidad NO conoce Express, ni repositorios,
 * ni base de datos. Es puro dominio — puede testearse sin ninguna dependencia externa.
 *
 * Cambios respecto a semana 5:
 * - El email ahora es un Value Object (Email) con validación encapsulada
 * - Las validaciones están en el constructor, no en el servicio
 * - Genera eventos de dominio cuando cambia su estado
 */
export class User {
  /**
   * @param {{ id: number|null, nombre: string, email: string }} params
   */
  constructor({ id, nombre, email }) {
    // Validación en el constructor — si falla, el objeto nunca existe
    if (!nombre || String(nombre).trim() === '') {
      throw new Error('El nombre del usuario es obligatorio');
    }

    this.id = id;
    this.nombre = String(nombre).trim();

    // Email es un Value Object — valida el formato automáticamente
    // Si email es undefined/null, lo permitimos (email opcional)
    this.email = email ? new Email(email) : null;

    this.fechaCreacion = new Date();
    this.ultimaActualizacion = new Date();
  }

  /**
   * Actualiza los datos del usuario.
   * Solo actualiza los campos que se pasan explícitamente.
   */
  update({ nombre, email }) {
    if (nombre !== undefined) {
      if (String(nombre).trim() === '') throw new Error('El nombre no puede estar vacío');
      this.nombre = String(nombre).trim();
    }
    if (email !== undefined) {
      this.email = email ? new Email(email) : null;
    }
    this.ultimaActualizacion = new Date();
  }

  /**
   * Serializa la entidad a un objeto plano (para HTTP responses).
   * El Value Object Email se convierte a string.
   */
  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email?.value ?? null,
      fechaCreacion: this.fechaCreacion,
      ultimaActualizacion: this.ultimaActualizacion,
    };
  }
}
