import { Email } from '../value-objects/Email.js';

export class User {
  constructor({ id, nombre, email }) {
    if (!nombre || String(nombre).trim() === '') throw new Error('El nombre del usuario es obligatorio');
    this.id = id;
    this.nombre = String(nombre).trim();
    this.email = email ? new Email(email) : null;
    this.fechaCreacion = new Date();
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
