# 🎓 Explicación Completa: Cómo Funciona Todo

## 📖 Índice
1. [¿Qué es un Servidor?](#qué-es-un-servidor)
2. [El Flujo Completo de una Petición](#el-flujo-completo)
3. [Cómo se Conectan las Piezas](#cómo-se-conectan-las-piezas)
4. [Ejemplo Paso a Paso](#ejemplo-paso-a-paso)
5. [Analogía del Restaurante](#analogía-del-restaurante)

---

## 🖥️ ¿Qué es un Servidor?

### Concepto Simple
Un servidor es como un **empleado que nunca duerme**:
- Está siempre esperando que le pidas algo
- Cuando le pides algo, lo hace y te responde
- Luego vuelve a esperar

### En Términos Técnicos
```javascript
// Cuando ejecutas: node server.js
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})

// Este código hace que el programa:
// 1. NO termine (se queda corriendo)
// 2. Escuche en el puerto 3000
// 3. Espere peticiones HTTP
```

### ¿Qué es un Puerto?
Un puerto es como un **número de apartamento**:

```
Tu computadora (Edificio)
├── Puerto 3000 → Tu API de librería
├── Puerto 8080 → Otro servidor
├── Puerto 5432 → Base de datos PostgreSQL
└── Puerto 27017 → Base de datos MongoDB
```

Cuando dices `http://localhost:3000`, estás diciendo:
- `localhost` = Mi computadora
- `3000` = El apartamento/puerto donde está tu servidor

---

## 🔄 El Flujo Completo de una Petición

### Ejemplo: Crear un Autor

```
PASO 1: Cliente envía petición
┌─────────────────────────────────────────┐
│ Cliente (Postman/Browser/curl)          │
│                                         │
│ POST http://localhost:3000/api/authors │
│ Content-Type: application/json         │
│ Body: {                                │
│   "name": "Gabriel García Márquez",    │
│   "nationality": "Colombiano",         │
│   "birthYear": 1927                    │
│ }                                      │
└────────────────┬────────────────────────┘
                 │ HTTP Request
                 ↓
┌─────────────────────────────────────────┐
│ PASO 2: Express recibe la petición     │
│ (server.js - línea: app.listen(3000))  │
│                                         │
│ Express detecta:                        │
│ - Método: POST                          │
│ - URL: /api/authors                     │
│ - Body: { name: "...", ... }            │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ PASO 3: Pasa por Middlewares           │
│ (server.js - líneas antes de las rutas)│
│                                         │
│ app.use(express.json())                 │
│ → Convierte el JSON del body a objeto   │
│                                         │
│ app.use((req, res, next) => {...})      │
│ → Imprime en consola: "POST /api/authors"│
│ → Llama next() para continuar          │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ PASO 4: Busca la Ruta Correspondiente  │
│ (server.js - línea: app.use('/api/...')│
│                                         │
│ Express busca en las rutas registradas: │
│ ✓ app.use('/api/authors', ...)         │
│   → ¡Coincide!                          │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ PASO 5: Entra al Router de Autores     │
│ (authorRoutes.js)                       │
│                                         │
│ router.post('/', (req, res) => ...)     │
│ → Coincide con POST /                   │
│ → Llama: authorController.create()      │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ PASO 6: Ejecuta el Controlador         │
│ (AuthorController.js - método create)   │
│                                         │
│ async create(req, res) {                │
│   const authorData = req.body           │
│   // authorData = { name: "...", ... }  │
│                                         │
│   const newAuthor =                     │
│     this.authorService.createAuthor()   │
│ }                                       │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ PASO 7: Llama al Servicio              │
│ (AuthorService.js - método createAuthor)│
│                                         │
│ createAuthor(authorData) {              │
│   // Validaciones                       │
│   if (!authorData.name) {               │
│     throw new Error('Nombre obligatorio')│
│   }                                     │
│                                         │
│   // Crear entidad                      │
│   const author = new Author(...)        │
│                                         │
│   // Guardar en repositorio             │
│   return this.authorRepository.create() │
│ }                                       │
└────────────────┬────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────┐
│ PASO 8: Guarda en el Repositorio       │
│ (AuthorRepository.js - método create)   │
│                                         │
│ create(author) {                        │
│   const id = this.nextId++              │
│   author.id = id                        │
│   this.authors.set(id, author)          │
│   // Guarda en Map (memoria)            │
│   return author                         │
│ }                                       │
└────────────────┬────────────────────────┘
                 │ Retorna author con id=1
                 ↓
┌─────────────────────────────────────────┐
│ PASO 9: Vuelve al Controlador          │
│ (AuthorController.js)                   │
│                                         │
│ const newAuthor = ... // Recibe el autor│
│                                         │
│ res.status(201).json({                  │
│   success: true,                        │
│   data: newAuthor,                      │
│   message: "Autor creado exitosamente"  │
│ })                                      │
└────────────────┬────────────────────────┘
                 │ HTTP Response
                 ↓
┌─────────────────────────────────────────┐
│ PASO 10: Cliente Recibe Respuesta      │
│                                         │
│ Status: 201 Created                     │
│ Body: {                                 │
│   "success": true,                      │
│   "data": {                             │
│     "id": 1,                            │
│     "name": "Gabriel García Márquez",   │
│     "nationality": "Colombiano",        │
│     "birthYear": 1927,                  │
│     "createdAt": "2026-02-26T..."       │
│   },                                    │
│   "message": "Autor creado exitosamente"│
│ }                                       │
└─────────────────────────────────────────┘
```

---

## 🧩 Cómo se Conectan las Piezas

### Diagrama de Conexiones

```
┌─────────────────────────────────────────────────────────┐
│                     server.js                           │
│  (PUNTO DE ENTRADA - Conecta todo)                      │
│                                                         │
│  1. Crea instancias:                                    │
│     const authorRepo = new AuthorRepository()          │
│     const bookRepo = new BookRepository()              │
│                                                         │
│  2. Inyecta dependencias:                               │
│     const authorService =                               │
│       new AuthorService(authorRepo)                     │
│                                                         │
│     const bookService =                                 │
│       new BookService(bookRepo, authorRepo)             │
│                                                         │
│  3. Crea controladores:                                 │
│     const authorController =                            │
│       new AuthorController(authorService)               │
│                                                         │
│  4. Registra rutas:                                     │
│     app.use('/api/authors',                             │
│       createAuthorRoutes(authorController))             │
│                                                         │
│  5. Inicia servidor:                                    │
│     app.listen(3000)                                    │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Cuando llega petición
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  authorRoutes.js                        │
│  (DEFINE QUÉ URL HACE QUÉ)                              │
│                                                         │
│  router.post('/', (req, res) =>                         │
│    authorController.create(req, res))                   │
│                                                         │
│  Traduce: POST /api/authors                             │
│  → Ejecuta: authorController.create()                   │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│              AuthorController.js                        │
│  (MANEJA HTTP - req y res)                              │
│                                                         │
│  create(req, res) {                                     │
│    const data = req.body  ← Extrae datos del HTTP       │
│    const author =                                       │
│      this.authorService.createAuthor(data)              │
│    res.json({ data: author })  ← Responde HTTP          │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│               AuthorService.js                          │
│  (LÓGICA DE NEGOCIO)                                    │
│                                                         │
│  createAuthor(data) {                                   │
│    // Validaciones                                      │
│    if (!data.name) throw Error()                        │
│                                                         │
│    // Crear entidad                                     │
│    const author = new Author(...)                       │
│                                                         │
│    // Guardar                                           │
│    return this.authorRepository.create(author)          │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│            AuthorRepository.js                          │
│  (ACCESO A DATOS)                                       │
│                                                         │
│  create(author) {                                       │
│    const id = this.nextId++                             │
│    author.id = id                                       │
│    this.authors.set(id, author)  ← Guarda en Map        │
│    return author                                        │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  Author.js                              │
│  (ENTIDAD - Modelo de Dominio)                          │
│                                                         │
│  class Author {                                         │
│    constructor(id, name, nationality, birthYear) {      │
│      this.id = id                                       │
│      this.name = name                                   │
│      this.nationality = nationality                     │
│      this.birthYear = birthYear                         │
│    }                                                    │
│                                                         │
│    getAge() { ... }                                     │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Ejemplo Paso a Paso con Código Real

### 1. Iniciar el Servidor

```javascript
// server.js - Línea final
app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})
```

**¿Qué hace esto?**
- Le dice a Express: "Escucha en el puerto 3000"
- El programa NO termina, se queda esperando
- Cada vez que llega una petición HTTP al puerto 3000, Express la procesa

**Analogía:** Es como abrir un negocio y poner un letrero "ABIERTO"

---

### 2. Cliente Hace Petición

```bash
# Desde otra terminal o Postman
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Gabriel García Márquez", "nationality": "Colombiano", "birthYear": 1927}'
```

**¿Qué pasa aquí?**
- `curl` es un programa que envía peticiones HTTP
- `-X POST` = Método HTTP POST
- `http://localhost:3000` = Dirección del servidor
- `/api/authors` = Ruta específica
- `-d '...'` = Datos que envías (el body)

**Analogía:** Es como llamar por teléfono al restaurante y hacer un pedido

---

### 3. Express Recibe y Procesa

```javascript
// server.js
app.use(express.json()) // Middleware 1: Parsea JSON

app.use((req, res, next) => { // Middleware 2: Logging
  console.log(`${req.method} ${req.url}`)
  // Imprime: "POST /api/authors"
  next() // Continúa al siguiente
})

// Registrar rutas
app.use('/api/authors', createAuthorRoutes(authorController))
```

**¿Qué hace cada línea?**

1. `express.json()`: Convierte el texto JSON del body en un objeto JavaScript
   - Antes: `'{"name": "..."}'` (string)
   - Después: `{ name: "..." }` (objeto)

2. Middleware de logging: Imprime qué petición llegó

3. `app.use('/api/authors', ...)`: Dice "todas las peticiones que empiecen con `/api/authors` las maneja este router"

---

### 4. Router Encuentra la Ruta

```javascript
// authorRoutes.js
export function createAuthorRoutes(authorController) {
  const router = express.Router()
  
  // POST / → En realidad es POST /api/authors
  router.post('/', (req, res) => authorController.create(req, res))
  
  return router
}
```

**¿Por qué `'/'` y no `'/api/authors'`?**
- Porque ya estamos DENTRO del router de `/api/authors`
- Es como estar dentro de una carpeta: ya no necesitas repetir la ruta completa

**Analogía:**
```
Dirección completa: Calle Principal 123, Apartamento 5
Dentro del edificio: Solo dices "Apartamento 5"
```

---

### 5. Controlador Maneja HTTP

```javascript
// AuthorController.js
async create(req, res) {
  try {
    const authorData = req.body
    // authorData = { name: "Gabriel García Márquez", ... }
    
    const newAuthor = this.authorService.createAuthor(authorData)
    
    res.status(201).json({
      success: true,
      data: newAuthor,
      message: 'Autor creado exitosamente'
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    })
  }
}
```

**Responsabilidades del Controlador:**
1. **Extraer datos del request:** `req.body`
2. **Llamar al servicio:** `this.authorService.createAuthor()`
3. **Enviar respuesta HTTP:** `res.status(201).json(...)`
4. **Manejar errores:** `catch` y enviar error como JSON

**NO hace:** Validaciones de negocio, acceso a datos (eso es del servicio)

---

### 6. Servicio Aplica Lógica de Negocio

```javascript
// AuthorService.js
createAuthor(authorData) {
  // VALIDACIONES
  if (!authorData.name || authorData.name.trim() === '') {
    throw new Error('El nombre es obligatorio')
  }
  
  if (authorData.birthYear > new Date().getFullYear()) {
    throw new Error('El año de nacimiento no puede ser futuro')
  }
  
  // CREAR ENTIDAD
  const author = new Author(
    null, // id se asigna en el repositorio
    authorData.name,
    authorData.nationality,
    authorData.birthYear
  )
  
  // GUARDAR
  return this.authorRepository.create(author)
}
```

**Responsabilidades del Servicio:**
1. **Validar datos de negocio**
2. **Crear entidades**
3. **Orquestar operaciones** (llamar a repositorios)

**NO hace:** Manejar HTTP, acceso directo a datos

---

### 7. Repositorio Guarda Datos

```javascript
// AuthorRepository.js
create(author) {
  const id = this.nextId++
  author.id = id
  this.authors.set(id, author)
  return author
}
```

**¿Qué es `this.authors`?**
```javascript
constructor() {
  this.authors = new Map() // Almacenamiento en memoria
  this.nextId = 1
}
```

**Map es como un diccionario:**
```javascript
Map {
  1 => { id: 1, name: "Gabriel García Márquez", ... },
  2 => { id: 2, name: "Isabel Allende", ... }
}
```

**Responsabilidades del Repositorio:**
1. **CRUD básico** (Create, Read, Update, Delete)
2. **Abstraer el almacenamiento** (hoy Map, mañana base de datos)

---

### 8. Respuesta Vuelve al Cliente

```javascript
// El controlador envía:
res.status(201).json({
  success: true,
  data: {
    id: 1,
    name: "Gabriel García Márquez",
    nationality: "Colombiano",
    birthYear: 1927,
    createdAt: "2026-02-26T01:44:19.917Z"
  },
  message: "Autor creado exitosamente"
})
```

**El cliente recibe:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Gabriel García Márquez",
    "nationality": "Colombiano",
    "birthYear": 1927,
    "createdAt": "2026-02-26T01:44:19.917Z"
  },
  "message": "Autor creado exitosamente"
}
```

---

## 🍽️ Analogía del Restaurante

Para entender mejor, imagina que la API es un restaurante:

```
┌─────────────────────────────────────────────────────────┐
│                    RESTAURANTE                          │
│                   (Tu API REST)                         │
└─────────────────────────────────────────────────────────┘

🚪 ENTRADA (Puerto 3000)
   │
   ↓
📋 MESERO (Rutas + Controlador)
   - Recibe tu pedido (HTTP Request)
   - Anota lo que quieres (extrae datos)
   - Lleva el pedido a la cocina
   │
   ↓
👨‍🍳 CHEF (Servicio)
   - Valida que el pedido sea correcto
   - Aplica recetas (lógica de negocio)
   - Coordina con el almacén
   │
   ↓
📦 ALMACÉN (Repositorio)
   - Guarda ingredientes (datos)
   - Busca ingredientes cuando se necesitan
   - Organiza el inventario
   │
   ↓
🥘 INGREDIENTES (Entidades)
   - Tomate, Cebolla, etc. (Author, Book)
   - Tienen propiedades (color, peso)
   - Pueden hacer cosas (madurar, cortarse)
```

### Ejemplo Concreto:

**Cliente:** "Quiero crear un autor llamado Gabriel García Márquez"

1. **Mesero (Controlador):** "Entendido, voy a la cocina"
2. **Chef (Servicio):** "Déjame verificar... ¿tiene nombre? Sí. ¿año válido? Sí. Procedo."
3. **Almacén (Repositorio):** "Guardado con ID #1"
4. **Mesero:** "Aquí está su autor creado, señor" (respuesta JSON)

---

## 🔑 Conceptos Clave

### 1. El Servidor NO Termina

```javascript
// Programa normal
console.log('Hola')
console.log('Adiós')
// Termina inmediatamente

// Servidor
app.listen(3000)
// NO termina, se queda esperando peticiones
```

### 2. Request y Response

```javascript
// req (request) = Lo que el cliente envía
req.body    // Datos en el body
req.params  // Parámetros de URL (/authors/:id)
req.query   // Query strings (?page=1)

// res (response) = Lo que envías al cliente
res.json({ data: ... })  // Enviar JSON
res.status(201)          // Código de estado
```

### 3. Middlewares

Son funciones que se ejecutan ANTES de llegar a la ruta:

```javascript
app.use((req, res, next) => {
  console.log('Petición recibida')
  next() // IMPORTANTE: Continúa al siguiente
})
```

### 4. Inyección de Dependencias

```javascript
// En lugar de crear dentro:
class BookService {
  constructor() {
    this.bookRepo = new BookRepository() // ❌ Acoplado
  }
}

// Inyectas desde fuera:
class BookService {
  constructor(bookRepository) {
    this.bookRepo = bookRepository // ✅ Flexible
  }
}

// Uso:
const repo = new BookRepository()
const service = new BookService(repo) // Inyectas
```

**Ventaja:** Puedes cambiar el repositorio sin tocar el servicio

---

## 🎯 Resumen Final

### ¿Qué es un Servidor?
Un programa que se queda corriendo esperando peticiones HTTP

### ¿Cómo se Conecta Todo?
```
Cliente → Express → Rutas → Controlador → Servicio → Repositorio → Entidad
                                                                      ↓
Cliente ← Express ← Rutas ← Controlador ← Servicio ← Repositorio ← Datos
```

### ¿Por Qué Esta Separación?
- **Controlador:** Maneja HTTP (no sabe de lógica de negocio)
- **Servicio:** Lógica de negocio (no sabe de HTTP)
- **Repositorio:** Acceso a datos (no sabe de lógica)
- **Entidad:** Modelo del dominio (no sabe de nada más)

### ¿Cómo Probar?
1. Iniciar servidor: `npm start`
2. Hacer peticiones: Postman, curl, navegador
3. Ver respuestas: JSON con datos

---

## 🚀 Próximos Pasos

1. Experimenta modificando el código
2. Agrega nuevos endpoints
3. Prueba con Postman
4. Lee los logs del servidor para entender el flujo
