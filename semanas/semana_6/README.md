# FitWell — Semana 06: Arquitectura Hexagonal

**Dominio:** Sistema de seguimiento de ejercicios  
**Arquitectura:** Hexagonal (Ports & Adapters)

## Estructura

```
src/
├── domain/                          ← El núcleo — sin dependencias externas
│   ├── value-objects/Email.js       ← Inmutable, valida formato de email
│   ├── entities/User.js             ← Entidad con Value Object Email
│   ├── aggregates/RoutineAggregate.js ← Invariante: 1 rutina activa por usuario
│   ├── services/RoutineDomainService.js ← Reglas de negocio complejas
│   └── ports/
│       ├── primary/IRoutineUseCases.js  ← Cómo el exterior usa el dominio
│       └── secondary/
│           ├── IRoutineRepository.js    ← Contrato de persistencia
│           ├── IUserRepository.js
│           └── INotificationService.js  ← Contrato de notificaciones
│
├── application/                     ← Orquestación — usa puertos, no implementaciones
│   └── use-cases/
│       ├── CreateRoutineUseCase.js  ← Crear rutina + notificar
│       ├── UpdateRoutineUseCase.js  ← Actualizar + regla de activación
│       ├── GetRoutineUseCase.js     ← Consultar rutinas
│       └── CreateUserUseCase.js    ← Crear usuario con email validado
│
├── infrastructure/                  ← Adaptadores secundarios (detalles técnicos)
│   ├── repositories/
│   │   ├── InMemoryUserRepository.js
│   │   └── InMemoryRoutineRepository.js
│   └── notifications/
│       └── ConsoleNotificationService.js
│
└── interfaces/http/                 ← Adaptadores primarios (entrada HTTP)
    ├── controllers/
    ├── routes/
    └── middleware/
```

## Ejecutar

```bash
npm install
npm run dev     # servidor en http://localhost:3000
npm test        # tests sin BD ni servidor
```

## Tests

```bash
npm test
# ≥ 10 pruebas, < 2000ms, sin conexiones externas
```

## Endpoints

| Método | Endpoint             | Descripción           |
| ------ | -------------------- | --------------------- |
| GET    | /api/v1/users        | Listar usuarios       |
| POST   | /api/v1/users        | Crear usuario         |
| GET    | /api/v1/routines     | Listar rutinas        |
| POST   | /api/v1/routines     | Crear rutina          |
| GET    | /api/v1/routines/:id | Obtener rutina        |
| PUT    | /api/v1/routines/:id | Actualizar rutina     |
| PATCH  | /api/v1/routines/:id | Actualización parcial |
| DELETE | /api/v1/routines/:id | Eliminar rutina       |

## Regla de negocio principal

Un usuario puede tener **máximo 1 rutina activa** a la vez.  
Al activar una rutina, las demás se desactivan automáticamente.  
Esta regla vive en `RoutineAggregate` y `RoutineDomainService` — nunca en el controlador.
