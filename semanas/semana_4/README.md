# Semana 04: Diseño de Componentes y Comunicación

## 📚 Proyecto: API REST para Sistema de Librería

Este proyecto implementa una API RESTful para gestionar una librería online.

### Dominio: Librería
- **Entidades**: Libros, Autores, Categorías
- **Operaciones**: CRUD completo para cada entidad
- **Relaciones**: Un libro tiene un autor, un autor puede tener múltiples libros

### Tecnologías
- Node.js v22
- Express.js (framework web)
- JavaScript ES2023 (módulos ESM)
- Swagger/OpenAPI (documentación)

### Estructura del Proyecto
```
semana_4/
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
├── docs/
│   └── openapi.yaml      # Especificación OpenAPI
├── package.json
└── README.md
```

### Instalación
```bash
cd semanas/semana_4
npm install
```

### Ejecución
```bash
npm start
```

El servidor estará disponible en: http://localhost:3000

### Endpoints Disponibles

#### Libros
- `GET /api/books` - Listar todos los libros
- `GET /api/books/:id` - Obtener un libro por ID
- `POST /api/books` - Crear un nuevo libro
- `PUT /api/books/:id` - Actualizar un libro
- `DELETE /api/books/:id` - Eliminar un libro

#### Autores
- `GET /api/authors` - Listar todos los autores
- `GET /api/authors/:id` - Obtener un autor por ID
- `POST /api/authors` - Crear un nuevo autor
- `PUT /api/authors/:id` - Actualizar un autor
- `DELETE /api/authors/:id` - Eliminar un autor

### Documentación API
Una vez iniciado el servidor, visita:
- Swagger UI: http://localhost:3000/api-docs

## 🎯 Conceptos Aplicados

### 1. Componentes y Separación de Responsabilidades
- **Domain**: Lógica de negocio pura (sin HTTP)
- **API**: Capa de presentación (HTTP, JSON)
- **Repositories**: Persistencia de datos

### 2. API RESTful
- Recursos bien definidos (`/books`, `/authors`)
- Verbos HTTP correctos (GET, POST, PUT, DELETE)
- Códigos de estado apropiados (200, 201, 404, 500)
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
