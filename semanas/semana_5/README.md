# FitWell API — Semana 05: Patrones de Diseño

**Autor:** David  
**Base:** API REST de semana 04 (Users + Routines)

## Patrones implementados

| Categoría      | Patrón         | Dónde                                                  |
| -------------- | -------------- | ------------------------------------------------------ |
| Creacional     | Singleton      | `AppConfig` — configuración global                     |
| Creacional     | Factory Method | `RoutineFactory` — creación de rutinas por tipo        |
| Estructural    | Decorator      | `LoggingRepositoryDecorator` — logging sin tocar repos |
| Comportamiento | Observer       | `EventBus` + observers — reacciones a eventos          |
| Comportamiento | Strategy       | `OffsetPaginationStrategy` — paginación intercambiable |

## Cómo ejecutar

```bash
npm install
npm run dev
```

Servidor en: `http://localhost:3000`

## Endpoints

| Método | Endpoint                   | Descripción                |
| ------ | -------------------------- | -------------------------- |
| GET    | /api/v1/users              | Listar usuarios (paginado) |
| POST   | /api/v1/users              | Crear usuario              |
| GET    | /api/v1/users/:id          | Obtener usuario            |
| PUT    | /api/v1/users/:id          | Actualizar usuario         |
| DELETE | /api/v1/users/:id          | Eliminar usuario           |
| GET    | /api/v1/users/:id/routines | Rutinas de un usuario      |
| GET    | /api/v1/routines           | Listar rutinas (filtros)   |
| POST   | /api/v1/routines           | Crear rutina (+ tipo)      |
| GET    | /api/v1/routines/:id       | Obtener rutina             |
| PUT    | /api/v1/routines/:id       | Actualizar rutina          |
| PATCH  | /api/v1/routines/:id       | Actualización parcial      |
| DELETE | /api/v1/routines/:id       | Eliminar rutina            |

## Novedad semana 05: campo `tipo` en rutinas

```json
POST /api/v1/routines
{
  "userId": 1,
  "nombre": "Mi rutina",
  "activa": false,
  "tipo": "avanzada"
}
```

Tipos: `"basica"` (default) | `"avanzada"` | `"recuperacion"`

## Documentación de patrones

Ver `docs/patrones-aplicados.md` para explicación detallada de cada patrón.
