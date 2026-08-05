/**
 * TESTS DE DOMINIO
 *
 * Prueban entidades, value objects, aggregate y domain service.
 * NO usan repositorios, NO usan HTTP, NO usan BD.
 * Son los tests más rápidos y los más importantes — prueban las reglas de negocio.
 *
 * Ejecutar: node --test tests/
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Email }                from '../src/domain/value-objects/Email.js';
import { User }                 from '../src/domain/entities/User.js';
import { RoutineAggregate }     from '../src/domain/aggregates/RoutineAggregate.js';
import { RoutineDomainService } from '../src/domain/services/RoutineDomainService.js';

// ── Value Object: Email ───────────────────────────────────────────────────────
describe('Email (Value Object)', () => {

  it('crea un email válido y lo normaliza a minúsculas', () => {
    const email = new Email('David@FitWell.COM');
    assert.equal(email.value, 'david@fitwell.com');
  });

  it('lanza error si el email no tiene @', () => {
    assert.throws(
      () => new Email('emailsinArroba.com'),
      /Email inválido/
    );
  });

  it('lanza error si el email está vacío', () => {
    assert.throws(
      () => new Email(''),
      /requerido/
    );
  });

  it('dos Email con el mismo valor son iguales (equals)', () => {
    const a = new Email('test@fitwell.com');
    const b = new Email('TEST@FITWELL.COM');
    assert.ok(a.equals(b));
  });

  it('es inmutable — no se puede cambiar el valor', () => {
    const email = new Email('test@fitwell.com');
    assert.throws(() => { email.value = 'otro@mail.com'; });
  });

});

// ── Entidad: User ─────────────────────────────────────────────────────────────
describe('User (Entidad)', () => {

  it('crea un usuario con nombre y email válidos', () => {
    const user = new User({ id: 1, nombre: 'David', email: 'david@fitwell.com' });
    assert.equal(user.nombre, 'David');
    assert.equal(user.email.value, 'david@fitwell.com');
  });

  it('lanza error si el nombre está vacío', () => {
    assert.throws(
      () => new User({ id: null, nombre: '', email: 'x@x.com' }),
      /nombre.*obligatorio/i
    );
  });

  it('permite crear usuario sin email (email opcional)', () => {
    const user = new User({ id: null, nombre: 'Sin Email' });
    assert.equal(user.email, null);
  });

  it('toJSON devuelve el email como string, no como objeto Email', () => {
    const user = new User({ id: 1, nombre: 'David', email: 'david@fitwell.com' });
    const json = user.toJSON();
    assert.equal(typeof json.email, 'string');
    assert.equal(json.email, 'david@fitwell.com');
  });

});

// ── Aggregate: RoutineAggregate ───────────────────────────────────────────────
describe('RoutineAggregate', () => {

  it('crea una rutina y genera evento RoutineCreated', () => {
    const aggregate = new RoutineAggregate(1, []);
    aggregate.createRoutine({ id: 1, nombre: 'Rutina A', activa: false });
    const events = aggregate.pullEvents();
    assert.equal(events.length, 1);
    assert.equal(events[0].type, 'RoutineCreated');
  });

  it('al activar una rutina, desactiva las demás (invariante)', () => {
    // Empezamos con 2 rutinas, una activa
    const rutinas = [
      { id: 1, userId: 1, nombre: 'Rutina A', activa: true },
      { id: 2, userId: 1, nombre: 'Rutina B', activa: false },
    ];
    const aggregate = new RoutineAggregate(1, rutinas);
    aggregate.activateRoutine(2); // activamos la B

    // La A debe estar desactivada, la B activa
    assert.equal(aggregate.routines[0].activa, false); // A desactivada
    assert.equal(aggregate.routines[1].activa, true);  // B activa
  });

  it('activar genera evento RoutineActivated', () => {
    const rutinas = [{ id: 1, userId: 1, nombre: 'Rutina A', activa: false }];
    const aggregate = new RoutineAggregate(1, rutinas);
    aggregate.activateRoutine(1);
    const events = aggregate.pullEvents();
    assert.equal(events[0].type, 'RoutineActivated');
  });

  it('pullEvents vacía los eventos después de leerlos', () => {
    const aggregate = new RoutineAggregate(1, []);
    aggregate.createRoutine({ id: 1, nombre: 'Test', activa: false });
    aggregate.pullEvents(); // primera lectura
    const second = aggregate.pullEvents(); // segunda lectura
    assert.equal(second.length, 0);
  });

  it('lanza error si el nombre de la rutina está vacío', () => {
    const aggregate = new RoutineAggregate(1, []);
    assert.throws(
      () => aggregate.createRoutine({ id: 1, nombre: '', activa: false }),
      /nombre.*obligatorio/i
    );
  });

});

// ── Domain Service: RoutineDomainService ─────────────────────────────────────
describe('RoutineDomainService', () => {

  it('validateCreation lanza error si falta el nombre', () => {
    const svc = new RoutineDomainService();
    assert.throws(
      () => svc.validateCreation({ nombre: '', userId: 1 }),
      /nombre.*obligatorio/i
    );
  });

  it('validateCreation lanza error si falta userId', () => {
    const svc = new RoutineDomainService();
    assert.throws(
      () => svc.validateCreation({ nombre: 'Rutina', userId: null }),
      /userId/i
    );
  });

  it('validateActivation devuelve las rutinas a desactivar', () => {
    const svc = new RoutineDomainService();
    const rutinas = [
      { id: 1, activa: true },
      { id: 2, activa: false },
    ];
    const result = svc.validateActivation(rutinas, 2);
    // La rutina 1 está activa y no es la target → debe desactivarse
    assert.equal(result.routinesToDeactivate.length, 1);
    assert.equal(result.routinesToDeactivate[0].id, 1);
  });

});
