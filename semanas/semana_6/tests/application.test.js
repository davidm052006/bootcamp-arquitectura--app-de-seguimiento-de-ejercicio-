/**
 * TESTS DE APLICACIÓN (Use Cases)
 *
 * Prueban los use cases usando mocks InMemory — sin BD, sin HTTP, sin servidor.
 * Verifican que la orquestación es correcta:
 *   - ¿Se llama al repositorio?
 *   - ¿Se aplican las reglas de negocio?
 *   - ¿Se notifica cuando corresponde?
 *
 * Ejecutar: node --test tests/
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

// Mock de notificaciones — registra las llamadas para verificarlas en tests
class MockNotificationService {
  constructor() { this.calls = []; }
  async notify(userId, message, type) {
    this.calls.push({ userId, message, type });
  }
}

// Helper: crea un usuario de prueba en el repositorio
async function crearUsuario(userRepo, nombre = 'David', email = 'david@fitwell.com') {
  const uc = new CreateUserUseCase(userRepo);
  return await uc.execute({ nombre, email });
}

// ── CreateRoutineUseCase ──────────────────────────────────────────────────────
describe('CreateRoutineUseCase', () => {

  it('crea una rutina correctamente', async () => {
    const userRepo    = new InMemoryUserRepository();
    const routineRepo = new InMemoryRoutineRepository();
    const domainSvc   = new RoutineDomainService();
    const notifSvc    = new MockNotificationService();

    const user = await crearUsuario(userRepo);
    const uc   = new CreateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);

    const routine = await uc.execute({ userId: user.id, nombre: 'Rutina A', activa: false });

    assert.ok(routine.id);
    assert.equal(routine.nombre, 'Rutina A');
    assert.equal(routine.activa, false);
  });

  it('lanza error si el usuario no existe', async () => {
    const userRepo    = new InMemoryUserRepository();
    const routineRepo = new InMemoryRoutineRepository();
    const uc = new CreateRoutineUseCase(routineRepo, userRepo, new RoutineDomainService(), new MockNotificationService());

    await assert.rejects(
      () => uc.execute({ userId: 999, nombre: 'Rutina', activa: false }),
      /usuario no encontrado/i
    );
  });

  it('al crear rutina activa, desactiva las demás del usuario', async () => {
    const userRepo    = new InMemoryUserRepository();
    const routineRepo = new InMemoryRoutineRepository();
    const domainSvc   = new RoutineDomainService();
    const notifSvc    = new MockNotificationService();
    const uc = new CreateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);

    const user = await crearUsuario(userRepo);

    // Crear primera rutina activa
    await uc.execute({ userId: user.id, nombre: 'Rutina A', activa: true });
    // Crear segunda rutina activa — debe desactivar la primera
    await uc.execute({ userId: user.id, nombre: 'Rutina B', activa: true });

    const todas = await routineRepo.findAll();
    const activas = todas.filter((r) => r.activa);
    assert.equal(activas.length, 1); // solo 1 activa
    assert.equal(activas[0].nombre, 'Rutina B');
  });

  it('envía notificación al crear rutina', async () => {
    const userRepo    = new InMemoryUserRepository();
    const routineRepo = new InMemoryRoutineRepository();
    const notifSvc    = new MockNotificationService();
    const uc = new CreateRoutineUseCase(routineRepo, userRepo, new RoutineDomainService(), notifSvc);

    const user = await crearUsuario(userRepo);
    await uc.execute({ userId: user.id, nombre: 'Rutina Test', activa: false });

    assert.equal(notifSvc.calls.length, 1);
    assert.ok(notifSvc.calls[0].message.includes('Rutina Test'));
  });

});

// ── UpdateRoutineUseCase ──────────────────────────────────────────────────────
describe('UpdateRoutineUseCase', () => {

  it('actualiza el nombre de una rutina', async () => {
    const userRepo    = new InMemoryUserRepository();
    const routineRepo = new InMemoryRoutineRepository();
    const domainSvc   = new RoutineDomainService();
    const notifSvc    = new MockNotificationService();

    const user = await crearUsuario(userRepo);
    const createUC = new CreateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);
    const updateUC = new UpdateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);

    const created = await createUC.execute({ userId: user.id, nombre: 'Original', activa: false });
    const updated  = await updateUC.execute(created.id, { nombre: 'Actualizada' });

    assert.equal(updated.nombre, 'Actualizada');
  });

  it('lanza error si la rutina no existe', async () => {
    const routineRepo = new InMemoryRoutineRepository();
    const userRepo    = new InMemoryUserRepository();
    const uc = new UpdateRoutineUseCase(routineRepo, userRepo, new RoutineDomainService(), new MockNotificationService());

    await assert.rejects(
      () => uc.execute(999, { nombre: 'X' }),
      /no encontrada/i
    );
  });

  it('activar una rutina envía notificación', async () => {
    const userRepo    = new InMemoryUserRepository();
    const routineRepo = new InMemoryRoutineRepository();
    const notifSvc    = new MockNotificationService();
    const domainSvc   = new RoutineDomainService();

    const user     = await crearUsuario(userRepo);
    const createUC = new CreateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);
    const updateUC = new UpdateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);

    const created = await createUC.execute({ userId: user.id, nombre: 'Rutina', activa: false });
    notifSvc.calls = []; // limpiar notificaciones previas

    await updateUC.execute(created.id, { activa: true });

    assert.equal(notifSvc.calls.length, 1);
    assert.ok(notifSvc.calls[0].message.includes('activa'));
  });

});

// ── GetRoutineUseCase ─────────────────────────────────────────────────────────
describe('GetRoutineUseCase', () => {

  it('obtiene una rutina por id', async () => {
    const userRepo    = new InMemoryUserRepository();
    const routineRepo = new InMemoryRoutineRepository();
    const notifSvc    = new MockNotificationService();
    const domainSvc   = new RoutineDomainService();

    const user     = await crearUsuario(userRepo);
    const createUC = new CreateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);
    const getUC    = new GetRoutineUseCase(routineRepo);

    const created = await createUC.execute({ userId: user.id, nombre: 'Rutina X', activa: false });
    const found   = await getUC.getById(created.id);

    assert.equal(found.nombre, 'Rutina X');
  });

  it('lanza error si la rutina no existe', async () => {
    const getUC = new GetRoutineUseCase(new InMemoryRoutineRepository());
    await assert.rejects(() => getUC.getById(999), /no encontrada/i);
  });

  it('lista rutinas filtrando por userId', async () => {
    const userRepo    = new InMemoryUserRepository();
    const routineRepo = new InMemoryRoutineRepository();
    const notifSvc    = new MockNotificationService();
    const domainSvc   = new RoutineDomainService();

    const user1 = await crearUsuario(userRepo, 'User1', 'u1@test.com');
    const user2 = await crearUsuario(userRepo, 'User2', 'u2@test.com');
    const createUC = new CreateRoutineUseCase(routineRepo, userRepo, domainSvc, notifSvc);
    const getUC    = new GetRoutineUseCase(routineRepo);

    await createUC.execute({ userId: user1.id, nombre: 'R1', activa: false });
    await createUC.execute({ userId: user1.id, nombre: 'R2', activa: false });
    await createUC.execute({ userId: user2.id, nombre: 'R3', activa: false });

    const deUser1 = await getUC.list({ userId: user1.id });
    assert.equal(deUser1.length, 2);
  });

});

// ── CreateUserUseCase ─────────────────────────────────────────────────────────
describe('CreateUserUseCase', () => {

  it('crea un usuario correctamente', async () => {
    const userRepo = new InMemoryUserRepository();
    const uc = new CreateUserUseCase(userRepo);
    const user = await uc.execute({ nombre: 'David', email: 'david@fitwell.com' });
    assert.ok(user.id);
    assert.equal(user.nombre, 'David');
  });

  it('lanza error si el email ya está registrado', async () => {
    const userRepo = new InMemoryUserRepository();
    const uc = new CreateUserUseCase(userRepo);
    await uc.execute({ nombre: 'David', email: 'david@fitwell.com' });
    await assert.rejects(
      () => uc.execute({ nombre: 'Otro', email: 'david@fitwell.com' }),
      /ya está registrado/i
    );
  });

  it('lanza error si el email tiene formato inválido', async () => {
    const uc = new CreateUserUseCase(new InMemoryUserRepository());
    await assert.rejects(
      () => uc.execute({ nombre: 'David', email: 'no-es-email' }),
      /Email inválido/i
    );
  });

});
