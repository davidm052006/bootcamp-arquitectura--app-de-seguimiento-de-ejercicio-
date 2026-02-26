# Arquitectura de la API - Explicación Detallada

## 🏗️ Estructura en Capas

```
┌─────────────────────────────────────┐
│         CLIENTE (Browser/App)       │
│  Hace peticiones HTTP (GET, POST)  │
└─────────────────┬───────────────────┘
                  │ HTTP Request
                  ↓
┌─────────────────────────────────────┐
│      CAPA API (Express.js)          │
│  ┌─────────────────────────────┐   │
│  │  Rutas (routes/)            │   │ ← Define URLs y métodos HTTP
│  │  /api/books, /api/authors   │   │
│  └──────────┬──────────────────┘   │
│             ↓                       │
│  ┌─────────────────────────────┐   │
│  │  Controladores (controllers)│   │ ← Maneja HTTP (req, res)
│  │  BookController, etc.       │   │
│  └──────────┬──────────────────┘   │
└─────────────┼───────────────────────┘
              │ Llama métodos
              ↓
┌─────────────────────────────────────┐
│    CAPA DOMINIO (Lógica Negocio)   │
│  ┌─────────────────────────────┐   │
│  │  Servicios (services/)      │   │ ← Lógica de negocio
│  │  BookService, AuthorService │   │   Validaciones, reglas
│  └──────────┬──────────────────┘   │
│             ↓                       │
│  ┌─────────────────────────────┐   │
│  │  Repositorios (repositories)│   │ ← Acceso a datos
│  │  BookRepository, etc.       │   │   CRUD básico
│  └──────────┬──────────────────┘   │
│             ↓                       │
│  ┌─────────────────────────────┐   │
│  │  Entidades (entities/)      │   │ ← Modelos de dominio
│  │  Book, Author               │   │   Clases con lógica
│  └─────────────────────────────┘   │
└─────────────┼───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│      ALMACENAMIENTO (Memoria)       │
│         Map<id, objeto>             │
└─────────────────────────────────────┘
```

## 📋 Flujo de una Petición Completa

### Ejemplo: Crear un libro

**1. Cliente envía petición:**
```http
POST http://localhost:3000/api/books
Content-Type: application/json

{
  "title": "Cien años de soledad",
  "authorId": 1,
  "isbn": "978-0307474728",
  "price": 25.99,
  "stock": 10
}
```

**2. Express recibe la petición:**
- El servidor está "escuchando" en el puerto 3000
- Express captura la petición POST a `/api/books`

**3. Pasa por middlewares:**
```javascript
app.use(express.json()) // Convierte el body JSON a objeto JavaScript
app.use((req, res, next) => { // Logging
  console.log('POST /api/books')
  next() // Continúa al siguiente
})
```

**4. Busca la ruta correspondiente:**
```javascript
// En bookRoutes.js
router.post('/', (req, res) => bookController.create(req, res))
```

**5. Ejecuta el controlador:**
```javascript
// En BookController.js
async create(req, res) {
  const bookData = req.body // { title: "...", authorId: 1, ... }
  const newBook = this.bookService.createBook(bookData)
  res.status(201).json({ success: true, data: newBook })
}
```

**6. El controlador llama al servicio:**
```javascript
// En BookService.js
createBook(bookData) {
  // Validar que el autor existe
  const author = this.authorRepository.findById(bookData.authorId)
  if (!author) throw new Error('Autor no existe')
  
  // Validar datos
  if (!bookData.title) throw new Error('Título obligatorio')
  
  // Crear entidad
  const book = new Book(null, bookData.title, ...)
  
  // Guardar en repositorio
  return this.bookRepository.create(book)
}
```

**7. El servicio usa el repositorio:**
```javascript
// En BookRepository.js
create(book) {
  const id = this.nextId++
  book.id = id
  this.books.set(id, book) // Guarda en Map
  return book
}
```

**8. Respuesta al cliente:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Cien años de soledad",
    "authorId": 1,
    "isbn": "978-0307474728",
    "price": 25.99,
    "stock": 10,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Libro creado exitosamente"
}
```

## 🎯 Responsabilidades de Cada Capa

### 1. Entidades (entities/)
**¿Qué hacen?** Representan conceptos del dominio

```javascript
class Book {
  constructor(id, title, authorId, isbn, price, stock) {
    this.id = id
    this.title = title
    // ...
  }
  
  isAvailable() {
    return this.stock > 0
  }
  
  sell(quantity) {
    if (quantity > this.stock) throw new Error('Stock insuficiente')
    this.stock -= quantity
  }
}
```

**Responsabilidad:** 
- Modelar el dominio
- Contener lógica relacionada con el objeto mismo
- NO saben de HTTP, bases de datos, etc.

### 2. Repositorios (repositories/)
**¿Qué hacen?** Manejan el almacenamiento de datos

```javascript
class BookRepository {
  constructor() {
    this.books = new Map() // Almacenamiento en memoria
  }
  
  create(book) { /* ... */ }
  findAll() { /* ... */ }
  findById(id) { /* ... */ }
  update(id, data) { /* ... */ }
  delete(id) { /* ... */ }
}
```

**Responsabilidad:**
- CRUD básico (Create, Read, Update, Delete)
- Abstraer el almacenamiento (hoy memoria, mañana base de datos)
- NO contienen lógica de negocio

### 3. Servicios (services/)
**¿Qué hacen?** Implementan la lógica de negocio

```javascript
class BookService {
  createBook(bookData) {
    // Validar que el autor existe
    const author = this.authorRepository.findById(bookData.authorId)
    if (!author) throw new Error('Autor no existe')
    
    // Validar datos
    if (!bookData.title) throw new Error('Título obligatorio')
    if (bookData.price < 0) throw new Error('Precio inválido')
    
    // Crear y guardar
    const book = new Book(...)
    return this.bookRepository.create(book)
  }
}
```

**Responsabilidad:**
- Validaciones de negocio
- Orquestar operaciones entre repositorios
- Aplicar reglas del dominio
- NO saben de HTTP

### 4. Controladores (controllers/)
**¿Qué hacen?** Traducen HTTP a lógica de negocio

```javascript
class BookController {
  async create(req, res) {
    try {
      const bookData = req.body // Extraer datos del HTTP request
      const newBook = this.bookService.createBook(bookData)
      res.status(201).json({ success: true, data: newBook }) // Respuesta HTTP
    } catch (error) {
      res.status(400).json({ success: false, error: error.message })
    }
  }
}
```

**Responsabilidad:**
- Extraer datos del request (body, params, query)
- Llamar al servicio apropiado
- Devolver respuesta HTTP con código de estado correcto
- Manejar errores y convertirlos en respuestas HTTP

### 5. Rutas (routes/)
**¿Qué hacen?** Mapean URLs a controladores

```javascript
function createBookRoutes(bookController) {
  const router = express.Router()
  
  router.get('/', (req, res) => bookController.getAll(req, res))
  router.post('/', (req, res) => bookController.create(req, res))
  router.get('/:id', (req, res) => bookController.getById(req, res))
  
  return router
}
```

**Responsabilidad:**
- Definir qué URL responde a qué método HTTP
- Conectar URLs con métodos del controlador

## 🔄 ¿Por Qué Esta Separación?

### Ventajas:

1. **Testeable**: Puedes probar servicios sin HTTP
2. **Reutilizable**: Los servicios pueden usarse desde API, CLI, etc.
3. **Mantenible**: Cambios en una capa no afectan otras
4. **Escalable**: Fácil agregar nuevas funcionalidades

### Ejemplo de Reutilización:

```javascript
// Mismo servicio usado desde diferentes lugares

// Desde API REST
app.post('/api/books', (req, res) => {
  const book = bookService.createBook(req.body)
  res.json(book)
})

// Desde CLI
const book = bookService.createBook({
  title: 'Mi libro',
  authorId: 1,
  // ...
})
console.log('Libro creado:', book)

// Desde GraphQL
const resolvers = {
  Mutation: {
    createBook: (_, args) => bookService.createBook(args)
  }
}
```

## 🚀 ¿Qué es Express.js?

Express es un **framework web minimalista** para Node.js que facilita:

1. **Crear un servidor HTTP**
2. **Definir rutas** (qué hacer cuando llega una petición a una URL)
3. **Usar middlewares** (funciones que procesan peticiones)
4. **Enviar respuestas** (JSON, HTML, etc.)

### Sin Express (Node.js puro):
```javascript
const http = require('http')

const server = http.createServer((req, res) => {
  if (req.url === '/api/books' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ books: [] }))
  } else if (req.url === '/api/books' && req.method === 'POST') {
    // Leer body manualmente...
    let body = ''
    req.on('data', chunk => body += chunk)
    req.on('end', () => {
      const data = JSON.parse(body)
      // ...
    })
  }
  // Manejar cada ruta manualmente...
})

server.listen(3000)
```

### Con Express:
```javascript
import express from 'express'
const app = express()

app.use(express.json()) // Parsea JSON automáticamente

app.get('/api/books', (req, res) => {
  res.json({ books: [] })
})

app.post('/api/books', (req, res) => {
  const data = req.body // Ya parseado!
  res.json({ success: true })
})

app.listen(3000)
```

**Mucho más simple, ¿verdad?**

## 📦 Conceptos Clave

### Middleware
Función que se ejecuta ANTES de llegar a la ruta final:

```javascript
// Middleware de logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next() // Continúa al siguiente middleware o ruta
})

// Middleware de autenticación (ejemplo)
app.use((req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'No autorizado' })
  }
  next()
})
```

### Request (req)
Objeto que contiene información de la petición:
- `req.body` - Datos enviados en el body (POST/PUT)
- `req.params` - Parámetros de la URL (/books/:id)
- `req.query` - Query strings (?page=1&limit=10)
- `req.headers` - Headers HTTP

### Response (res)
Objeto para enviar respuestas:
- `res.json(data)` - Envía JSON
- `res.status(code)` - Define código de estado
- `res.send(text)` - Envía texto plano

## 🎓 Resumen

1. **Node.js** = Motor que ejecuta JavaScript en el servidor
2. **Express** = Framework que facilita crear APIs
3. **API REST** = Servidor que responde a peticiones HTTP con JSON
4. **Arquitectura en capas** = Separar responsabilidades para código mantenible
5. **El servidor se queda corriendo** = Esperando peticiones en un puerto
