export class Routine {
  constructor({ id, userId, nombre, descripcion = '', activa = false }) {
    this.id = id;
    this.userId = userId;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.activa = Boolean(activa);
    this.fechaCreacion = new Date();
    this.ultimaActualizacion = new Date();
  }

  setActiva(activa) {
    this.activa = Boolean(activa);
    this.ultimaActualizacion = new Date();
  }

  update({ nombre, descripcion, activa }) {
    if (nombre !== undefined) this.nombre = nombre;
    if (descripcion !== undefined) this.descripcion = descripcion;
    if (activa !== undefined) this.setActiva(activa);
    else this.ultimaActualizacion = new Date();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      nombre: this.nombre,
      descripcion: this.descripcion,
      activa: this.activa,
      fechaCreacion: this.fechaCreacion,
      ultimaActualizacion: this.ultimaActualizacion,
    };
  }
}
