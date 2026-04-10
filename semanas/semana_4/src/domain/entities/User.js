export class User {
  constructor({ id, nombre, email }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.fechaCreacion = new Date();
    this.ultimaActualizacion = new Date();
  }

  update({ nombre, email }) {
    if (nombre !== undefined) this.nombre = nombre;
    if (email !== undefined) this.email = email;
    this.ultimaActualizacion = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      fechaCreacion: this.fechaCreacion,
      ultimaActualizacion: this.ultimaActualizacion,
    };
  }
}

