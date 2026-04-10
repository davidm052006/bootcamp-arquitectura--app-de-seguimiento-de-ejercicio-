/**
 * TESTS DE DOMINIO — Semana 07
 * Sin BD, sin HTTP, sin servidor. Solo lógica pura.
 * Ejecutar: npm test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { Email }                from '../src/domain/value-objects/Email.js';
import { User }                 from '../src/domain/entities/User.js';
import { RoutineDomainService } from '../src/domain/services/RoutineDomainService.js';

describe('Email (Value Object)', () => {
  it('crea un email válido y lo normaliza a minúsculas', () => {
    assert.equal(new Email('David@FitWell.COM').value, 'david@fitwell.com');
  });
  it('lanza error si el email no tiene @', () => {
    assert.throws(() => new Email('emailsinArroba.com'), /Email inválido/);
  });
  it('lanza error si el email está vacío', () => {
    assert.throws(() => new Email(''), /requerido/);
  });
  it('dos Email con el mismo valor son iguales', () => {
    assert.ok(new Email('test@fitwell.com').equals(new Email('TEST@FITWELL.COM')));
  });
  it('es inmutable', () => {
    const e = new Email('test@fitwell.com');
    assert.throws(() => { e.value = 'otro@mail.com'; });
  });
});

describe('User (Entidad)', () => {
  it('crea usuario con nombre y email válidos', () => {
    const u = new User({ id: 1, nombre: 'David', email: 'david@fitwell.com' });
    assert.equal(u.nombre, 'David');
    assert.equal(u.email.value, 'david@fitwell.com');
  });
  it('lanza error si el nombre está vacío', () => {
    assert.throws(() => new User({ id: null, nombre: '', email: 'x@x.com' }), /nombre.*obligatorio/i);
  });
  it('permite crear usuario sin email', () => {
    assert.equal(new User({ id: null, nombre: 'Sin Email' }).email, null);
  });
  it('toJSON devuelve email como string', () => {
    const json = new User({ id: 1, nombre: 'David', email: 'david@fitwell.com' }).toJSON();
    assert.equal(typeof json.email, 'string');
  });
});

describe('RoutineDomainService', () => {
  it('validateCreation lanza error si falta el nombre', () => {
    assert.throws(() => new RoutineDomainService().validateCreation({ nombre: '', userId: 1 }), /nombre.*obligatorio/i);
  });
  it('validateCreation lanza error si falta userId', () => {
    assert.throws(() => new RoutineDomainService().validateCreation({ nombre: 'R', userId: null }), /userId/i);
  });
  it('validateActivation devuelve rutinas a desactivar', () => {
    const result = new RoutineDomainService().validateActivation(
      [{ id: 1, activa: true }, { id: 2, activa: false }], 2
    );
    assert.equal(result.routinesToDeactivate.length, 1);
    assert.equal(result.routinesToDeactivate[0].id, 1);
  });
});
