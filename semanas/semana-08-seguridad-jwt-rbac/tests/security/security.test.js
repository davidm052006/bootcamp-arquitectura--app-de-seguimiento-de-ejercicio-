/**
 * TESTS DE SEGURIDAD — Semana 08
 *
 * Prueban TokenService, PasswordService, authorize middleware y use cases de auth.
 * SIN BD, SIN servidor HTTP, SIN conexiones externas.
 *
 * Ejecutar: npm test
 */
import { describe, it, before } from 'node:test';
import assert from 'node:assert/strict';

import { TokenService }    from '../../src/infrastructure/security/TokenService.js';
import { PasswordService } from '../../src/infrastructure/security/PasswordService.js';
import { authorize }       from '../../src/interfaces/http/middleware/authorize.js';
import { RegisterUserUseCase } from '../../src/application/use-cases/RegisterUserUseCase.js';
import { LoginUserUseCase }    from '../../src/application/use-cases/LoginUserUseCase.js';
import { InMemoryUserRepository } from '../../src/infrastructure/repositories/InMemoryUserRepository.js';

// ── TokenService ──────────────────────────────────────────────────────────────
describe('TokenService', () => {

  it('genera un token y lo verifica correctamente', () => {
    const svc = new TokenService();
    const token = svc.sign({ userId: 1, role: 'user' });
    const payload = svc.verify(token);
    assert.equal(payload.userId, 1);
    assert.equal(payload.role, 'user');
  });

  it('lanza error si el token está manipulado', () => {
    const svc = new TokenService();
    const token = svc.sign({ userId: 1, role: 'user' });
    const tampered = token.slice(0, -5) + 'XXXXX'; // modificar la firma
    assert.throws(() => svc.verify(tampered), /inválido/i);
  });

  it('lanza error si el payload no tiene userId', () => {
    const svc = new TokenService();
    assert.throws(() => svc.sign({ role: 'user' }), /userId/i);
  });

  it('lanza error si el payload no tiene role', () => {
    const svc = new TokenService();
    assert.throws(() => svc.sign({ userId: 1 }), /role/i);
  });

});

// ── PasswordService ───────────────────────────────────────────────────────────
describe('PasswordService', () => {

  it('hashea una contraseña y la verifica correctamente', async () => {
    const svc  = new PasswordService(4); // rounds bajos para tests rápidos
    const hash = await svc.hash('miPassword123');
    assert.ok(hash.startsWith('$2')); // formato bcrypt
    assert.ok(await svc.verify('miPassword123', hash));
  });

  it('rechaza contraseña incorrecta', async () => {
    const svc  = new PasswordService(4);
    const hash = await svc.hash('correcta123');
    assert.equal(await svc.verify('incorrecta123', hash), false);
  });

  it('lanza error si la contraseña tiene menos de 8 caracteres', async () => {
    const svc = new PasswordService(4);
    await assert.rejects(() => svc.hash('corta'), /8 caracteres/i);
  });

});

// ── authorize middleware ──────────────────────────────────────────────────────
describe('authorize middleware (RBAC)', () => {

  // Helper: simula req, res, next para testear middlewares sin servidor
  function mockReqRes(role) {
    const req = { user: { userId: 1, role } };
    const res = {
      status(code) { this._status = code; return this; },
      json(body)   { this._body = body; return this; },
      _status: null, _body: null,
    };
    let nextCalled = false;
    const next = () => { nextCalled = true; };
    return { req, res, next: () => { nextCalled = true; }, isNextCalled: () => nextCalled };
  }

  it('permite acceso si el rol está en la lista', () => {
    const { req, res, next, isNextCalled } = mockReqRes('admin');
    authorize('admin')(req, res, next);
    assert.ok(isNextCalled());
  });

  it('bloquea acceso si el rol no está permitido (403)', () => {
    const { req, res, next } = mockReqRes('user');
    authorize('admin')(req, res, next);
    assert.equal(res._status, 403);
  });

  it('permite múltiples roles', () => {
    const { req, res, next, isNextCalled } = mockReqRes('user');
    authorize('user', 'admin')(req, res, next);
    assert.ok(isNextCalled());
  });

  it('devuelve 401 si no hay req.user', () => {
    const req = {};
    const res = { status(c) { this._s = c; return this; }, json(b) { this._b = b; return this; } };
    authorize('admin')(req, res, () => {});
    assert.equal(res._s, 401);
  });

});

// ── RegisterUserUseCase + LoginUserUseCase ────────────────────────────────────
describe('Auth Use Cases', () => {

  it('registra un usuario y devuelve datos sin passwordHash', async () => {
    const repo    = new InMemoryUserRepository();
    const passSvc = new PasswordService(4);
    const uc      = new RegisterUserUseCase(repo, passSvc);

    const user = await uc.execute({ nombre: 'David', email: 'david@fitwell.com', password: 'segura123' });

    assert.ok(user.id);
    assert.equal(user.nombre, 'David');
    assert.equal(user.passwordHash, undefined); // NO debe estar en la respuesta
  });

  it('login devuelve token JWT válido', async () => {
    const repo    = new InMemoryUserRepository();
    const passSvc = new PasswordService(4);
    const tokenSvc = new TokenService();

    await new RegisterUserUseCase(repo, passSvc)
      .execute({ nombre: 'David', email: 'david@fitwell.com', password: 'segura123' });

    const result = await new LoginUserUseCase(repo, passSvc, tokenSvc)
      .execute({ email: 'david@fitwell.com', password: 'segura123' });

    assert.ok(result.token);
    const payload = tokenSvc.verify(result.token);
    assert.equal(payload.role, 'user');
  });

  it('login con credenciales incorrectas lanza error genérico', async () => {
    const repo    = new InMemoryUserRepository();
    const passSvc = new PasswordService(4);
    const tokenSvc = new TokenService();

    await new RegisterUserUseCase(repo, passSvc)
      .execute({ nombre: 'David', email: 'david@fitwell.com', password: 'segura123' });

    await assert.rejects(
      () => new LoginUserUseCase(repo, passSvc, tokenSvc)
        .execute({ email: 'david@fitwell.com', password: 'incorrecta' }),
      /Credenciales inválidas/i // mensaje genérico — no revela si el email existe
    );
  });

  it('login con email inexistente lanza el mismo error genérico', async () => {
    const repo = new InMemoryUserRepository();
    await assert.rejects(
      () => new LoginUserUseCase(repo, new PasswordService(4), new TokenService())
        .execute({ email: 'noexiste@fitwell.com', password: 'cualquiera' }),
      /Credenciales inválidas/i
    );
  });

});
