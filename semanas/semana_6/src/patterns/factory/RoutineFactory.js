import { Routine } from '../../domain/entities/Routine.js';

/**
 * PATRÓN: FACTORY METHOD
 *
 * Problema: En RoutineService.createRoutine(), la construcción del objeto Routine
 * estaba mezclada con validaciones y lógica de negocio. Además, si querías crear
 * rutinas con valores por defecto distintos según el tipo (básica, avanzada,
 * recuperación), tenías que agregar ifs dentro del servicio.
 *
 * Solución: Una factory centraliza la creación de Routines según su tipo,
 * con valores por defecto apropiados para cada caso. El servicio solo llama
 * a la factory y no sabe cómo se construye internamente.
 */
export class RoutineFactory {
  /**
   * Crea una rutina básica — para usuarios nuevos, sin equipamiento especial.
   */
  static createBasica({ userId, nombre, descripcion = '' }) {
    return new Routine({
      id: null,
      userId,
      nombre,
      descripcion: descripcion || 'Rutina básica de inicio — peso corporal',
      activa: false,
    });
  }

  /**
   * Crea una rutina avanzada — para usuarios con experiencia y equipamiento.
   */
  static createAvanzada({ userId, nombre, descripcion = '' }) {
    return new Routine({
      id: null,
      userId,
      nombre,
      descripcion: descripcion || 'Rutina avanzada — requiere equipamiento',
      activa: false,
    });
  }

  /**
   * Crea una rutina de recuperación — baja intensidad, activa por defecto.
   */
  static createRecuperacion({ userId, nombre }) {
    return new Routine({
      id: null,
      userId,
      nombre,
      descripcion: 'Rutina de recuperación activa — movilidad y stretching',
      activa: true, // recuperación siempre arranca activa
    });
  }

  /**
   * Método genérico — decide el tipo según el parámetro `tipo`.
   * Usado por el servicio para no tener que conocer los métodos específicos.
   */
  static create(tipo = 'basica', datos) {
    switch (tipo) {
      case 'avanzada':    return RoutineFactory.createAvanzada(datos);
      case 'recuperacion': return RoutineFactory.createRecuperacion(datos);
      default:            return RoutineFactory.createBasica(datos);
    }
  }
}
