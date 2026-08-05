/**
 * TESTS DE APLICACIÓN — Semana 07
 * Usan InMemory — sin BD, sin HTTP, sin servidor.
 * Ejecutar: npm test
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { InMemoryUserRepository }    from '../src/infrastructure/repositories/InMemoryUserRepository.js';
import { InMemoryRoutineRepository } from '../src/infrastructure/repositories/InMemoryRoutineRepository.js';
import { RoutineDomainService }      from '../src/domain/services/RoutineDomainService.js';
import { CreateRoutineUseCase }      from '../src/application/use-cases/CreateRoutineUseCase.js';
import { UpdateRoutineUseCase }      from '../src/application/use-cases/UpdateRoutineUseCase.js';
import { GetRoutineUseCase }         from '../src/application/use-cases/GetRoutineUseCase.js';
import { CreateUserUseCase }         from '../src/application/use-cases/CreateUserUseCase.js';

class MockNotif { constructor() { this.calls = []; } async notify(u, m, t) { this.calls.push({ u, m, t }); } }

async function crearUsuario(repo, nombre = 'David', email = 'david@fitwell.com') {
  return new CreateUserUseCase(repo).execute({ nombre, email });
}

describe('CreateRoutineUseCase', () => {
  it('crea una rutina correctamente', async () => {
    const uR = new InMemoryUserRepository(), rR = new InMemoryRoutineRepository();
    const user = await crearUsuario(uR);
    const r = await new CreateRoutineUseCase(rR, uR, new RoutineDomainService(), new MockNotif())
      .execute({ userId: user.id, nombre: 'Rutina A', activa: false });
    assert.ok(r.id); assert.equal(r.nombre, 'Rutina A');
  });

  it('lanza error si el usuario no existe', async () => {
    await assert.rejects(
      () => new CreateRoutineUseCase(new InMemoryRoutineRepository(), new InMemoryUserRepository(), new RoutineDomainService(), new MockNotif())
        .execute({ userId: 999, nombre: 'R', activa: false }),
      /usuario no encontrado/i
    );
  });

  it('al crear rutina activa, desactiva las demás', async () => {
    const uR = new InMemoryUserRepository(), rR = new InMemoryRoutineRepository();
    const uc = new CreateRoutineUseCase(rR, uR, new RoutineDomainService(), new MockNotif());
    const user = await crearUsuario(uR);
    await uc.execute({ userId: user.id, nombre: 'A', activa: true });
    await uc.execute({ userId: user.id, nombre: 'B', activa: true });
    const activas = (await rR.findAll()).filter((r) => r.activa);
    assert.equal(activas.length, 1);
    assert.equal(activas[0].nombre, 'B');
  });

  it('envía notificación al crear rutina', async () => {
    const uR = new InMemoryUserRepository(), rR = new InMemoryRoutineRepository();
    const notif = new MockNotif();
    const user = await crearUsuario(uR);
    await new CreateRoutineUseCase(rR, uR, new RoutineDomainService(), notif)
      .execute({ userId: user.id, nombre: 'Test', activa: false });
    assert.equal(notif.calls.length, 1);
  });
});

describe('UpdateRoutineUseCase', () => {
  it('actualiza el nombre de una rutina', async () => {
    const uR = new InMemoryUserRepository(), rR = new InMemoryRoutineRepository();
    const svc = new RoutineDomainService(), notif = new MockNotif();
    const user = await crearUsuario(uR);
    const created = await new CreateRoutineUseCase(rR, uR, svc, notif).execute({ userId: user.id, nombre: 'Original', activa: false });
    const updated = await new UpdateRoutineUseCase(rR, uR, svc, notif).execute(created.id, { nombre: 'Actualizada' });
    assert.equal(updated.nombre, 'Actualizada');
  });

  it('lanza error si la rutina no existe', async () => {
    await assert.rejects(
      () => new UpdateRoutineUseCase(new InMemoryRoutineRepository(), new InMemoryUserRepository(), new RoutineDomainService(), new MockNotif())
        .execute(999, { nombre: 'X' }),
      /no encontrada/i
    );
  });

  it('activar rutina envía notificación', async () => {
    const uR = new InMemoryUserRepository(), rR = new InMemoryRoutineRepository();
    const svc = new RoutineDomainService(), notif = new MockNotif();
    const user = await crearUsuario(uR);
    const created = await new CreateRoutineUseCase(rR, uR, svc, notif).execute({ userId: user.id, nombre: 'R', activa: false });
    notif.calls = [];
    await new UpdateRoutineUseCase(rR, uR, svc, notif).execute(created.id, { activa: true });
    assert.equal(notif.calls.length, 1);
  });
});

describe('GetRoutineUseCase', () => {
  it('obtiene rutina por id', async () => {
    const uR = new InMemoryUserRepository(), rR = new InMemoryRoutineRepository();
    const user = await crearUsuario(uR);
    const created = await new CreateRoutineUseCase(rR, uR, new RoutineDomainService(), new MockNotif())
      .execute({ userId: user.id, nombre: 'X', activa: false });
    const found = await new GetRoutineUseCase(rR).getById(created.id);
    assert.equal(found.nombre, 'X');
  });

  it('lanza error si la rutina no existe', async () => {
    await assert.rejects(() => new GetRoutineUseCase(new InMemoryRoutineRepository()).getById(999), /no encontrada/i);
  });

  it('lista rutinas filtrando por userId', async () => {
    const uR = new InMemoryUserRepository(), rR = new InMemoryRoutineRepository();
    const uc = new CreateRoutineUseCase(rR, uR, new RoutineDomainService(), new MockNotif());
    const u1 = await crearUsuario(uR, 'U1', 'u1@t.com');
    const u2 = await crearUsuario(uR, 'U2', 'u2@t.com');
    await uc.execute({ userId: u1.id, nombre: 'R1', activa: false });
    await uc.execute({ userId: u1.id, nombre: 'R2', activa: false });
    await uc.execute({ userId: u2.id, nombre: 'R3', activa: false });
    assert.equal((await new GetRoutineUseCase(rR).list({ userId: u1.id })).length, 2);
  });
});

describe('CreateUserUseCase', () => {
  it('crea usuario correctamente', async () => {
    const u = await new CreateUserUseCase(new InMemoryUserRepository()).execute({ nombre: 'David', email: 'david@fitwell.com' });
    assert.ok(u.id); assert.equal(u.nombre, 'David');
  });
  it('lanza error si email duplicado', async () => {
    const repo = new InMemoryUserRepository();
    const uc = new CreateUserUseCase(repo);
    await uc.execute({ nombre: 'David', email: 'david@fitwell.com' });
    await assert.rejects(() => uc.execute({ nombre: 'Otro', email: 'david@fitwell.com' }), /ya está registrado/i);
  });
  it('lanza error si email inválido', async () => {
    await assert.rejects(
      () => new CreateUserUseCase(new InMemoryUserRepository()).execute({ nombre: 'D', email: 'no-email' }),
      /Email inválido/i
    );
  });
});
