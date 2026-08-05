# FitWell API — Arquitectura de Software progresiva

[🇬🇧 English version](README.en.md)

Backend de **FitWell**, una app de entrenamiento en casa, construido en 8
semanas donde cada entrega aplica un nivel más de madurez arquitectónica
sobre el mismo dominio: de un CRUD simple a una API con arquitectura
hexagonal, Docker y seguridad JWT/RBAC.

> El planteamiento inicial (semana 1) contemplaba Spring Boot + React;
> el proyecto evolucionó hacia **Node.js/Express**, que es lo que
> finalmente se construyó y lo que documenta este README.

## Problema que busca resolver

Las rutinas de entrenamiento genéricas no consideran el equipo real que
tiene cada usuario en casa (mancuernas, banda elástica, o solo peso
corporal), ni su morfología o IMC. FitWell adapta rutinas y planes de
alimentación al equipamiento y condición real de cada usuario, con un
backend pensado para crecer: empieza como una API en memoria y termina
como un servicio con persistencia en PostgreSQL, autenticación JWT, control
de acceso por roles y despliegue en contenedores.

## Qué aprendí

- Aplicar los principios **SOLID** a un dominio real y justificar cada uno
  (`semana-02`).
- Elegir y documentar un patrón arquitectónico con un ADR formal,
  evaluando alternativas y trade-offs (`semana-03`).
- Diseñar una **API REST** con capas separadas (rutas, controladores,
  dominio) (`semana-04`).
- Aplicar patrones de diseño clásicos —Factory, Strategy, Observer,
  Decorator, Singleton— a problemas concretos del dominio (`semana-05`).
- Migrar a **arquitectura hexagonal** (puertos y adaptadores), separando
  dominio, aplicación e infraestructura (`semana-06`).
- Preparar el servicio para la nube: Docker, 12-factor app, variables de
  entorno, health checks (`semana-07`).
- Asegurar la API con JWT, RBAC (roles `user`/`admin`), rate limiting,
  hardening HTTP con Helmet y protección OWASP básica (`semana-08`).

## Tecnologías usadas

| Tecnología | Uso |
| --- | --- |
| Node.js + Express | Servidor HTTP |
| PostgreSQL | Persistencia (semanas 7-8; semanas previas usan repositorios en memoria) |
| Docker + Docker Compose | Contenerización y despliegue reproducible |
| JWT + bcrypt (`PasswordService`) | Autenticación y hashing de contraseñas |
| Zod | Validación de entrada |
| Helmet, CORS, rate limiting | Hardening HTTP (OWASP) |
| Node Test Runner | Tests unitarios y de seguridad |
| [Graphify](https://github.com/Graphify-Labs/graphify) | Grafo de dependencias del código (`graphify-out/`), generado localmente sin LLM |

## Resultados

- 8 entregas semanales, cada una una API funcional e independiente
  (`npm install && npm test` en cada carpeta).
- Arquitectura final (semana 8): hexagonal, con dominio, casos de uso,
  puertos/adaptadores, patrones de diseño (`src/patterns/`) y capa HTTP
  separada — 15 tests de seguridad en verde.
- Al revisar el código con Graphify detecté carpetas `src/api/` y
  `src/middleware/` duplicadas y sin usar, que quedaron de la migración a
  arquitectura hexagonal en las semanas 6-8: las eliminé y verifiqué que
  los tests de esas 3 semanas siguen pasando (15, 25 y 30 tests
  respectivamente).

## Estructura

```
semanas/
├── semana-01-planteamiento-inicial/
├── semana-02-principios-solid/
├── semana-03-patron-arquitectonico/
├── semana-04-api-rest-componentes/
├── semana-05-patrones-diseno/
├── semana-06-arquitectura-hexagonal/
├── semana-07-cloud-native-docker/
└── semana-08-seguridad-jwt-rbac/
docs/
└── diagramas/           # Diagrama de arquitectura (Mermaid/SVG)
```

Cada carpeta `semana-NN-tema/` tiene su propio `README.md` con las
instrucciones exactas para instalarla y ejecutarla.

## Cómo iniciar y probar

Cada semana es una API independiente (la más completa es `semana-08`):

```bash
cd semanas/semana-08-seguridad-jwt-rbac
cp .env.example .env
npm install
npm run dev      # http://localhost:3000
npm test         # 15 tests de seguridad
```

Las semanas 7-8 incluyen Docker:

```bash
docker compose up -d
```

## Licencia

Proyecto educativo — Bootcamp de Arquitectura de Software, SENA.
