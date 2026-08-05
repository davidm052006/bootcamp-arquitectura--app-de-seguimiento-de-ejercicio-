# Semana 04: Diseño de Componentes y Comunicación

## 🏋️ Proyecto: API REST para Sistema de Seguimiento de Ejercicios

Este proyecto implementa una API RESTful para gestionar un sistema de seguimiento de ejercicios.

### Dominio: Seguimiento de Ejercicios
- **Entidad principal (recurso principal)**: Rutinas
- **Entidad secundaria**: Usuarios
- **Regla de negocio clave**: Un usuario puede tener solo una rutina activa a la vez (si activas una, se desactivan las demás del mismo usuario).

### Tecnologías
- Node.js v22
- Express.js (framework web)
- JavaScript ES2023 (módulos ESM)
- Swagger/OpenAPI (documentación)

### Estructura del Proyecto
```
semana-04-api-rest-componentes/
├── openapi.yaml         # Especificación OpenAPI
├── docs/
│   └── diagrama-componentes.svg
├── tests/
│   └── api.http
├── src/
│   ├── domain/           # Lógica de negocio
│   │   ├── entities/     # Clases de dominio
│   │   ├── repositories/ # Acceso a datos (memoria)
│   │   └── services/     # Lógica de aplicación
│   ├── api/              # Capa de API REST
│   │   ├── routes/       # Definición de rutas
│   │   ├── controllers/  # Controladores HTTP
│   │   └── middlewares/  # Middlewares (validación, errores)
│   └── server.js         # Punto de entrada del servidor
├── package.json
└── README.md
```

### Instalación
```bash
cd semanas/semana-04-api-rest-componentes
npm install
```

### Ejecución
```bash
npm start
```

El servidor estará disponible en: http://localhost:3000

### Endpoints Disponibles

#### Rutinas (Recurso principal)
- `GET /api/v1/routines` - Listar rutinas (con filtros y paginación)
- `GET /api/v1/routines/:id` - Obtener rutina por ID
- `POST /api/v1/routines` - Crear rutina
- `PUT /api/v1/routines/:id` - Actualizar rutina
- `PATCH /api/v1/routines/:id` - Actualización parcial (ej: activar)
- `DELETE /api/v1/routines/:id` - Eliminar rutina (204)

#### Usuarios (Recurso secundario)
- `GET /api/v1/users` - Listar usuarios (paginación)
- `GET /api/v1/users/:id` - Obtener usuario
- `POST /api/v1/users` - Crear usuario (409 si email duplicado)
- `PUT /api/v1/users/:id` - Actualizar usuario
- `DELETE /api/v1/users/:id` - Eliminar usuario (204)
- `GET /api/v1/users/:id/routines` - Ver rutinas de un usuario (paginación)

### Documentación API
Una vez iniciado el servidor, visita:
- Swagger UI: http://localhost:3000/api-docs

### Persistencia (¿necesito base de datos?)
Por ahora **NO**. Los datos se almacenan **en memoria** (Map) en los repositorios.
- ✅ Puedes crear/consultar/actualizar/eliminar por API sin DB.
- ⚠️ Al reiniciar el servidor, se pierden los datos.

## 🎯 Conceptos Aplicados

### 1. Componentes y Separación de Responsabilidades
- **Domain**: Lógica de negocio pura (sin HTTP)
- **API**: Capa de presentación (HTTP, JSON)
- **Repositories**: Persistencia de datos

### 2. API RESTful
- Recursos bien definidos (`/api/v1/routines`, `/api/v1/users`)
- Verbos HTTP correctos (GET, POST, PUT, DELETE)
- Códigos de estado apropiados (200, 201, 204, 400, 404, 409, 500)
- Respuestas en JSON

### 3. Comunicación Síncrona
- Request-Response pattern
- Cliente espera respuesta inmediata
- Ideal para operaciones CRUD

## 📝 Notas de Aprendizaje

### ¿Qué es Express.js?
Express es un framework minimalista para crear servidores web en Node.js. Facilita:
- Definir rutas (endpoints)
- Manejar peticiones HTTP
- Enviar respuestas JSON
- Usar middlewares (funciones intermedias)

### Flujo de una Petición HTTP
```
Cliente (Postman/Browser)
    ↓ HTTP Request
Servidor Express (puerto 3000)
    ↓ Enrutador (routes)
Controlador (controllers)
    ↓ Llama a
Servicio (services)
    ↓ Usa
Repositorio (repositories)
    ↓ HTTP Response
Cliente recibe JSON
```

### Códigos de Estado HTTP
- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Datos inválidos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor
