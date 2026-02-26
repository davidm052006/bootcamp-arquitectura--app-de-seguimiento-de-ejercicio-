# Ejemplos de Peticiones HTTP

Este archivo contiene ejemplos de cómo probar la API usando diferentes herramientas.

## Herramientas para Probar APIs

1. **Navegador** - Solo para peticiones GET
2. **curl** - Desde la terminal (Windows CMD/PowerShell)
3. **Postman** - Aplicación gráfica (recomendado para principiantes)
4. **Thunder Client** - Extensión de VS Code

## 1. Crear Autores

### Con curl (PowerShell)
```powershell
curl -X POST http://localhost:3000/api/authors `
  -H "Content-Type: application/json" `
  -d '{\"name\": \"Gabriel García Márquez\", \"nationality\": \"Colombiano\", \"birthYear\": 1927}'
```

### Con curl (CMD)
```cmd
curl -X POST http://localhost:3000/api/authors -H "Content-Type: application/json" -d "{\"name\": \"Gabriel Garcia Marquez\", \"nationality\": \"Colombiano\", \"birthYear\": 1927}"
```

### Datos de ejemplo (JSON)
```json
{
  "name": "Gabriel García Márquez",
  "nationality": "Colombiano",
  "birthYear": 1927
}
```

```json
{
  "name": "Isabel Allende",
  "nationality": "Chilena",
  "birthYear": 1942
}
```

```json
{
  "name": "Jorge Luis Borges",
  "nationality": "Argentino",
  "birthYear": 1899
}
```

## 2. Listar Todos los Autores

### Con navegador
Abre: http://localhost:3000/api/authors

### Con curl
```powershell
curl http://localhost:3000/api/authors
```

## 3. Obtener un Autor Específico

### Con navegador
Abre: http://localhost:3000/api/authors/1

### Con curl
```powershell
curl http://localhost:3000/api/authors/1
```

## 4. Crear Libros

### Datos de ejemplo (JSON)
```json
{
  "title": "Cien años de soledad",
  "authorId": 1,
  "isbn": "978-0307474728",
  "price": 25.99,
  "stock": 10
}
```

```json
{
  "title": "El amor en los tiempos del cólera",
  "authorId": 1,
  "isbn": "978-0307387738",
  "price": 22.50,
  "stock": 5
}
```

```json
{
  "title": "La casa de los espíritus",
  "authorId": 2,
  "isbn": "978-1501117015",
  "price": 18.99,
  "stock": 8
}
```

### Con curl (PowerShell)
```powershell
curl -X POST http://localhost:3000/api/books `
  -H "Content-Type: application/json" `
  -d '{\"title\": \"Cien años de soledad\", \"authorId\": 1, \"isbn\": \"978-0307474728\", \"price\": 25.99, \"stock\": 10}'
```

## 5. Listar Todos los Libros

### Con navegador
Abre: http://localhost:3000/api/books

### Con curl
```powershell
curl http://localhost:3000/api/books
```

## 6. Actualizar un Libro

### Con curl (PowerShell)
```powershell
curl -X PUT http://localhost:3000/api/books/1 `
  -H "Content-Type: application/json" `
  -d '{\"price\": 29.99, \"stock\": 15}'
```

## 7. Eliminar un Libro

### Con curl
```powershell
curl -X DELETE http://localhost:3000/api/books/1
```

## 8. Obtener Libros de un Autor

### Con navegador
Abre: http://localhost:3000/api/books/author/1

### Con curl
```powershell
curl http://localhost:3000/api/books/author/1
```

## Respuestas Esperadas

### Éxito (200/201)
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa"
}
```

### Error (400/404)
```json
{
  "success": false,
  "error": "Descripción del error"
}
```

## Códigos de Estado HTTP

- **200 OK**: Operación exitosa (GET, PUT, DELETE)
- **201 Created**: Recurso creado exitosamente (POST)
- **400 Bad Request**: Datos inválidos
- **404 Not Found**: Recurso no encontrado
- **500 Internal Server Error**: Error del servidor

## Flujo de Prueba Recomendado

1. Iniciar el servidor: `npm start`
2. Verificar que funciona: `curl http://localhost:3000/health`
3. Crear 2-3 autores (POST /api/authors)
4. Listar autores (GET /api/authors)
5. Crear libros asociados a esos autores (POST /api/books)
6. Listar libros (GET /api/books)
7. Actualizar un libro (PUT /api/books/:id)
8. Eliminar un libro (DELETE /api/books/:id)
