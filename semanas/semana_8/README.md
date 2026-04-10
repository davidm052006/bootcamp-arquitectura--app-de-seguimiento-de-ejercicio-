# FitWell API — Semana 08: Seguridad (JWT + RBAC + OWASP)

## Ejecutar

```bash
cp .env.example .env
npm install
npm run dev     # http://localhost:3000
npm test        # 15 tests de seguridad, ~554ms
```

## Flujo de autenticación

```
1. POST /auth/register  →  { nombre, email, password }
2. POST /auth/login     →  { email, password }  →  { token, user }
3. GET  /api/v1/routines  →  Authorization: Bearer <token>
```

## Roles (RBAC)

| Acción                | user | admin |
| --------------------- | ---- | ----- |
| Ver sus rutinas       | ✅   | ✅    |
| Crear rutinas         | ✅   | ✅    |
| Eliminar rutinas      | ❌   | ✅    |
| Ver todas las rutinas | ❌   | ✅    |

## Seguridad implementada

| Medida            | Implementación                            |
| ----------------- | ----------------------------------------- |
| Contraseñas       | bcryptjs (hash + salt automático)         |
| Autenticación     | JWT firmado con HS256, expira en 15m      |
| Autorización      | RBAC con middleware authorize()           |
| Headers HTTP      | Helmet (X-Frame-Options, CSP, HSTS...)    |
| CORS              | Solo orígenes en ALLOWED_ORIGINS          |
| Rate limiting     | /auth: 10 req/15min — /api: 100 req/15min |
| Validación input  | Zod en todos los endpoints                |
| Mensajes de error | Genéricos (no revelan si email existe)    |
| Body size         | Límite 10kb (evita payload attacks)       |

## Estructura nueva (vs semana 7)

```
src/
├── infrastructure/security/
│   ├── PasswordService.js    ← bcrypt hash/verify
│   ├── TokenService.js       ← JWT sign/verify
│   └── rateLimiter.js        ← express-rate-limit
├── application/use-cases/
│   ├── RegisterUserUseCase.js
│   └── LoginUserUseCase.js
├── interfaces/http/
│   ├── middleware/
│   │   ├── authenticate.js   ← valida JWT → req.user
│   │   ├── authorize.js      ← RBAC → 403 si no tiene rol
│   │   └── validate.js       ← Zod → 400 si input inválido
│   ├── controllers/
│   │   └── AuthController.js
│   └── routes/
│       └── authRoutes.js
└── app.js                    ← Helmet + CORS + rate limit
```
