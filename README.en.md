# FitWell API — Progressive Software Architecture

[🇪🇸 Versión en español](README.md)

Backend for **FitWell**, a home-workout app, built over 8 weeks where each
delivery applies one more level of architectural maturity to the same
domain: from a simple CRUD to an API with hexagonal architecture, Docker,
and JWT/RBAC security.

> The initial plan (week 1) considered Spring Boot + React; the project
> evolved into **Node.js/Express**, which is what was actually built and
> what this README documents.

## Problem it addresses

Generic workout routines don't account for the equipment a user actually
has at home (dumbbells, resistance bands, or just bodyweight), nor their
body type or BMI. FitWell adapts routines and meal plans to each user's
real equipment and condition, with a backend designed to grow: it starts
as an in-memory API and ends as a service with PostgreSQL persistence, JWT
authentication, role-based access control, and container deployment.

## What I learned

- Applying **SOLID** principles to a real domain and justifying each one
  (`semana-02`).
- Choosing and documenting an architectural pattern with a formal ADR,
  evaluating alternatives and trade-offs (`semana-03`).
- Designing a **REST API** with separated layers (routes, controllers,
  domain) (`semana-04`).
- Applying classic design patterns —Factory, Strategy, Observer,
  Decorator, Singleton— to concrete domain problems (`semana-05`).
- Migrating to **hexagonal architecture** (ports and adapters), separating
  domain, application, and infrastructure (`semana-06`).
- Preparing the service for the cloud: Docker, 12-factor app, environment
  variables, health checks (`semana-07`).
- Securing the API with JWT, RBAC (`user`/`admin` roles), rate limiting,
  HTTP hardening with Helmet, and basic OWASP protections (`semana-08`).

## Technologies used

| Technology | Use |
| --- | --- |
| Node.js + Express | HTTP server |
| PostgreSQL | Persistence (weeks 7-8; earlier weeks use in-memory repositories) |
| Docker + Docker Compose | Containerization and reproducible deployment |
| JWT + bcrypt (`PasswordService`) | Authentication and password hashing |
| Zod | Input validation |
| Helmet, CORS, rate limiting | HTTP hardening (OWASP) |
| Node Test Runner | Unit and security tests |
| [Graphify](https://github.com/Graphify-Labs/graphify) | Code dependency graph (`graphify-out/`), generated locally with no LLM |

## Results

- 8 weekly deliveries, each a functional, independent API
  (`npm install && npm test` in each folder).
- Final architecture (week 8): hexagonal, with domain, use cases,
  ports/adapters, design patterns (`src/patterns/`), and a separate HTTP
  layer — 15 security tests passing.
- Reviewing the code with Graphify surfaced duplicated, unused `src/api/`
  and `src/middleware/` folders left over from the migration to hexagonal
  architecture in weeks 6-8: removed them and verified tests for all 3
  weeks still pass (15, 25, and 30 tests respectively).

## Structure

```
semanas/
├── semana-01-planteamiento-inicial/   # week 1 — initial planning
├── semana-02-principios-solid/        # week 2 — SOLID principles
├── semana-03-patron-arquitectonico/   # week 3 — architectural pattern (ADR)
├── semana-04-api-rest-componentes/    # week 4 — REST API components
├── semana-05-patrones-diseno/         # week 5 — design patterns
├── semana-06-arquitectura-hexagonal/  # week 6 — hexagonal architecture
├── semana-07-cloud-native-docker/     # week 7 — cloud native / Docker
└── semana-08-seguridad-jwt-rbac/      # week 8 — JWT/RBAC security
docs/
└── diagramas/           # Architecture diagram (Mermaid/SVG)
```

Each `semana-NN-topic/` folder has its own `README.md` with exact
install/run instructions.

## How to run and test

Each week is an independent API (the most complete is `semana-08`):

```bash
cd semanas/semana-08-seguridad-jwt-rbac
cp .env.example .env
npm install
npm run dev      # http://localhost:3000
npm test         # 15 security tests
```

Weeks 7-8 include Docker:

```bash
docker compose up -d
```

## License

Educational project — Software Architecture Bootcamp, SENA.
