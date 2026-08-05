export class Routine {
  constructor({ id, userId, nombre, descripcion = '', activa = false }) {
    if (!nombre || String(nombre).trim() === '') throw new Error('El nombre de la rutina es obligatorio');
    this.id = id; this.userId = userId;
    this.nombre = String(nombre).trim(); this.descripcion = String(descripcion);
    this.activa = Boolean(activa);
    this.fechaCreacion = new Date(); this.ultimaActualizacion = new Date();
  }
  setActiva(activa) { this.activa = Boolean(activa); this.ultimaActualizacion = new Date(); }
  toJSON() {
    return { id: this.id, userId: this.userId, nombre: this.nombre,
      descripcion: this.descripcion, activa: this.activa,
      fechaCreacion: this.fechaCreacion, ultimaActualizacion: this.ultimaActualizacion };
  }
}
