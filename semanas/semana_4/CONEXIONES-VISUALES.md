# 🎨 Conexiones Visuales - Cómo se Conecta Todo

## 🏗️ Vista General de la Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                         TU COMPUTADORA                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    PUERTO 3000                            │ │
│  │              (Dirección del Servidor)                     │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│                              ↓                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   EXPRESS SERVER                          │ │
│  │                    (server.js)                            │ │
│  │                                                           │ │
│  │  Está corriendo y esperando peticiones...                │ │
│  └───────────────────────────────────────────────────────────┘ │
│                              │                                  │
│              ┌───────────────┼───────────────┐                 │
│              ↓               ↓               ↓                 │
│     ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│     │   RUTAS     │  │   RUTAS     │  │   RUTAS     │        │
│     │  /authors   │  │   /books    │  │   /health   │        │
│     └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

## 📞 ¿Cómo Llega una Petición?

### Desde el Navegador

```
┌──────────────────────────────────────────────────────┐
│  NAVEGADOR (Chrome, Firefox, etc.)                  │
│                                                      │
│  Escribes: http://localhost:3000/api/authors        │
│                                                      │
│  [Enter] ──────────────────────────────────────────┐ │
└────────────────────────────────────────────────────┼─┘
                                                     │
                    Petición HTTP GET                │
                                                     ↓
┌──────────────────────────────────────────────────────┐
│  TU SERVIDOR (corriendo en terminal)                │
│                                                      │
│  Recibe: GET /api/authors                           │
│  Procesa...                                          │
│  Responde: JSON con lista de autores                │
│                                                      │
│  ────────────────────────────────────────────────┐  │
└──────────────────────────────────────────────────┼──┘
                                                   │
                    Respuesta JSON                 │
                                                   ↓
┌──────────────────────────────────────────────────────┐
│  NAVEGADOR                                           │
│                                                      │
│  Muestra:                                            │
│  {                                                   │
│    "success": true,                                  │
│    "data": [                                         │
│      { "id": 1, "name": "Gabriel..." }               │
│    ]                                                 │
│  }                                                   │
└──────────────────────────────────────────────────────┘
```

### Desde Postman o curl

```
┌──────────────────────────────────────────────────────┐
│  POSTMAN / CURL                                      │
│                                                      │
│  POST http://localhost:3000/api/authors             │
│  Body: {                                             │
│    "name": "Gabriel García Márquez",                 │
│    "nationality": "Colombiano",                      │
│    "birthYear": 1927                                 │
│  }                                                   │
│                                                      │
│  [Send] ─────────────────────────────────────────┐  │
└──────────────────────────────────────────────────┼──┘
                                                   │
                Petición HTTP POST                 │
                                                   ↓
┌──────────────────────────────────────────────────────┐
│  TU SERVIDOR                                         │
│                                                      │
│  Recibe: POST /api/authors                          │
│  Body: { name: "...", ... }                          │
│  Procesa...                                          │
│  Crea autor con ID 1                                 │
│  Responde: JSON con autor creado                     │
│                                                      │
│  ────────────────────────────────────────────────┐  │
└──────────────────────────────────────────────────┼──┘
                                                   │
                Respuesta JSON                     │
                                                   ↓
┌──────────────────────────────────────────────────────┐
│  POSTMAN / CURL                                      │
│                                                      │
│  Status: 201 Created                                 │
│  {                                                   │
│    "success": true,                                  │
│    "data": {                                         │
│      "id": 1,                                        │
│      "name": "Gabriel García Márquez",               │
│      ...                                             │
│    }                                                 │
│  }                                                   │
└──────────────────────────────────────────────────────┘
```

## 🔗 Conexión Entre Archivos

### 1. server.js - El Orquestador

```javascript
// server.js

// PASO 1: Importar todo lo necesario
import express from 'express'
import { AuthorRepository } from './domain/repositories/AuthorRepository.js'
import { AuthorService } from './domain/services/AuthorService.js'
import { AuthorController } from './api/controllers/AuthorController.js'
import { createAuthorRoutes } from './api/routes/authorRoutes.js'

// PASO 2: Crear la app Express
const app = express()

// PASO 3: Configurar middlewares
app.use(express.json()) // Para parsear JSON

// PASO 4: Crear las instancias (Inyección de Dependencias)
const authorRepo = new AuthorRepository()
//      ↓ Se lo pasamos al servicio
const authorService = new AuthorService(authorRepo)
//      ↓ Se lo pasamos al controlador
const authorController = new AuthorController(authorService)

// PASO 5: Registrar rutas
//      ↓ Le pasamos el controlador
app.use('/api/authors', createAuthorRoutes(authorController))

// PASO 6: Iniciar servidor
app.listen(3000, () => {
  console.log('Servidor corriendo')
})
```

**Flujo de Dependencias:**
```
AuthorRepository
       ↓ (se inyecta en)
AuthorService
       ↓ (se inyecta en)
AuthorController
       ↓ (se usa en)
authorRoutes
       ↓ (se registra en)
Express App
```

### 2. authorRoutes.js - Define URLs

```javascript
// authorRoutes.js

export function createAuthorRoutes(authorController) {
  const router = express.Router()
  
  // Cuando llega: GET /api/authors
  router.get('/', (req, res) => {
    // Ejecuta este método del controlador
    authorController.getAll(req, res)
  })
  
  // Cuando llega: POST /api/authors
  router.post('/', (req, res) => {
    authorController.create(req, res)
  })
  
  // Cuando llega: GET /api/authors/1
  router.get('/:id', (req, res) => {
    authorController.getById(req, res)
  })
  
  return router
}
```

**Mapeo URL → Método:**
```
GET  /api/authors     →  authorController.getAll()
POST /api/authors     →  authorController.create()
GET  /api/authors/:id →  authorController.getById()
PUT  /api/authors/:id →  authorController.update()
DELETE /api/authors/:id → authorController.delete()
```

### 3. AuthorController.js - Maneja HTTP

```javascript
// AuthorController.js

export class AuthorController {
  constructor(authorService) {
    this.authorService = authorService // Guarda referencia al servicio
  }
  
  async create(req, res) {
    try {
      // 1. Extraer datos del HTTP request
      const authorData = req.body
      
      // 2. Llamar al servicio (lógica de negocio)
      const newAuthor = this.authorService.createAuthor(authorData)
      
      // 3. Enviar respuesta HTTP
      res.status(201).json({
        success: true,
        data: newAuthor
      })
    } catch (error) {
      // 4. Manejar errores
      res.status(400).json({
        success: false,
        error: error.message
      })
    }
  }
}
```

**Responsabilidades:**
```
HTTP Request (req)
       ↓
Extraer datos (req.body, req.params)
       ↓
Llamar servicio (this.authorService.createAuthor())
       ↓
Recibir resultado
       ↓
Enviar HTTP Response (res.json())
```

### 4. AuthorService.js - Lógica de Negocio

```javascript
// AuthorService.js

export class AuthorService {
  constructor(authorRepository) {
    this.authorRepository = authorRepository // Guarda referencia al repo
  }
  
  createAuthor(authorData) {
    // 1. Validar datos
    if (!authorData.name) {
      throw new Error('Nombre obligatorio')
    }
    
    if (authorData.birthYear > 2026) {
      throw new Error('Año inválido')
    }
    
    // 2. Crear entidad
    const author = new Author(
      null,
      authorData.name,
      authorData.nationality,
      authorData.birthYear
    )
    
    // 3. Guardar usando el repositorio
    return this.authorRepository.create(author)
  }
}
```

**Responsabilidades:**
```
Datos sin validar
       ↓
Validaciones de negocio
       ↓
Crear entidad (new Author())
       ↓
Llamar repositorio (this.authorRepository.create())
       ↓
Retornar resultado
```

### 5. AuthorRepository.js - Acceso a Datos

```javascript
// AuthorRepository.js

export class AuthorRepository {
  constructor() {
    this.authors = new Map() // Almacenamiento en memoria
    this.nextId = 1
  }
  
  create(author) {
    // 1. Generar ID
    const id = this.nextId++
    
    // 2. Asignar ID al autor
    author.id = id
    
    // 3. Guardar en Map
    this.authors.set(id, author)
    
    // 4. Retornar autor con ID
    return author
  }
  
  findAll() {
    return Array.from(this.authors.values())
  }
  
  findById(id) {
    return this.authors.get(id) || null
  }
}
```

**Almacenamiento en Map:**
```
Map {
  1 => Author { id: 1, name: "Gabriel...", ... },
  2 => Author { id: 2, name: "Isabel...", ... },
  3 => Author { id: 3, name: "Jorge...", ... }
}
```

### 6. Author.js - Entidad

```javascript
// Author.js

export class Author {
  constructor(id, name, nationality, birthYear) {
    this.id = id
    this.name = name
    this.nationality = nationality
    this.birthYear = birthYear
    this.createdAt = new Date()
  }
  
  getAge() {
    return new Date().getFullYear() - this.birthYear
  }
  
  isContemporary() {
    return this.getAge() < 120
  }
}
```

**Representa un concepto del dominio:**
```
Author
├── Propiedades: id, name, nationality, birthYear
└── Métodos: getAge(), isContemporary()
```

## 🔄 Flujo Completo con Números de Línea

```
1. Cliente envía: POST /api/authors
                  Body: { name: "Gabriel...", ... }
                  
2. Express recibe en puerto 3000
   └─> server.js línea: app.listen(3000)

3. Pasa por middlewares
   └─> server.js línea: app.use(express.json())
       Convierte JSON string a objeto JavaScript

4. Busca ruta registrada
   └─> server.js línea: app.use('/api/authors', ...)
       ¡Coincide!

5. Entra al router
   └─> authorRoutes.js línea: router.post('/', ...)
       Ejecuta: authorController.create(req, res)

6. Controlador extrae datos
   └─> AuthorController.js línea: const authorData = req.body
       authorData = { name: "Gabriel...", ... }

7. Controlador llama servicio
   └─> AuthorController.js línea: this.authorService.createAuthor(authorData)

8. Servicio valida
   └─> AuthorService.js líneas: if (!authorData.name) throw Error()
       ✓ Validaciones pasan

9. Servicio crea entidad
   └─> AuthorService.js línea: const author = new Author(...)
       author = Author { id: null, name: "Gabriel...", ... }

10. Servicio llama repositorio
    └─> AuthorService.js línea: return this.authorRepository.create(author)

11. Repositorio asigna ID y guarda
    └─> AuthorRepository.js líneas:
        const id = this.nextId++ // id = 1
        author.id = id
        this.authors.set(id, author)
        return author

12. Resultado vuelve al servicio
    └─> author = Author { id: 1, name: "Gabriel...", ... }

13. Resultado vuelve al controlador
    └─> newAuthor = author

14. Controlador envía respuesta HTTP
    └─> AuthorController.js línea: res.status(201).json({ ... })

15. Cliente recibe respuesta
    └─> Status: 201 Created
        Body: { success: true, data: { id: 1, ... } }
```

## 🎯 Analogía: Cadena de Restaurantes

Imagina que tienes una cadena de restaurantes (tu API):

```
┌─────────────────────────────────────────────────────┐
│              CADENA DE RESTAURANTES                 │
│                  (Tu API REST)                      │
└─────────────────────────────────────────────────────┘

🏢 SEDE CENTRAL (server.js)
   - Coordina todo
   - Contrata empleados
   - Asigna responsabilidades
   │
   ├─> 📋 MESEROS (Controladores)
   │    - Atienden clientes
   │    - Toman pedidos
   │    - Entregan comida
   │
   ├─> 👨‍🍳 CHEFS (Servicios)
   │    - Preparan comida
   │    - Siguen recetas
   │    - Validan ingredientes
   │
   ├─> 📦 ALMACÉN (Repositorios)
   │    - Guardan ingredientes
   │    - Organizan inventario
   │    - Buscan productos
   │
   └─> 🥘 INGREDIENTES (Entidades)
        - Tomate, Cebolla, etc.
        - Tienen propiedades
        - Pueden hacer cosas
```

**Flujo de un Pedido:**

1. **Cliente:** "Quiero un autor llamado Gabriel"
2. **Mesero (Controlador):** "Entendido, voy a la cocina"
3. **Chef (Servicio):** "Verifico ingredientes... OK, procedo"
4. **Almacén (Repositorio):** "Guardado con etiqueta #1"
5. **Chef:** "Listo, aquí está"
6. **Mesero:** "Su autor, señor" (entrega JSON)

## 🧪 Experimento: Sigue el Flujo

Vamos a seguir una petición real paso a paso:

### Petición: Crear un Autor

```bash
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name": "Isabel Allende", "nationality": "Chilena", "birthYear": 1942}'
```

### Paso 1: Express Recibe

```
Terminal del Servidor:
POST /api/authors  ← Impreso por el middleware de logging
```

### Paso 2: Entra al Controlador

```javascript
// AuthorController.js - método create()
const authorData = req.body
// authorData = { name: "Isabel Allende", nationality: "Chilena", birthYear: 1942 }
```

### Paso 3: Llama al Servicio

```javascript
// AuthorService.js - método createAuthor()
// Validaciones...
if (!authorData.name) throw Error() // ✓ Pasa
if (authorData.birthYear > 2026) throw Error() // ✓ Pasa

const author = new Author(null, "Isabel Allende", "Chilena", 1942)
// author = { id: null, name: "Isabel Allende", ... }
```

### Paso 4: Guarda en Repositorio

```javascript
// AuthorRepository.js - método create()
const id = this.nextId++ // id = 2 (porque ya existe el 1)
author.id = id
this.authors.set(2, author)

// Map ahora tiene:
// Map {
//   1 => { id: 1, name: "Gabriel...", ... },
//   2 => { id: 2, name: "Isabel Allende", ... }
// }

return author // { id: 2, name: "Isabel Allende", ... }
```

### Paso 5: Respuesta al Cliente

```javascript
// AuthorController.js
res.status(201).json({
  success: true,
  data: { id: 2, name: "Isabel Allende", ... },
  message: "Autor creado exitosamente"
})
```

### Cliente Recibe:

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Isabel Allende",
    "nationality": "Chilena",
    "birthYear": 1942,
    "createdAt": "2026-02-26T..."
  },
  "message": "Autor creado exitosamente"
}
```

## 🎓 Resumen de Conexiones

### Conexión Física (Archivos)

```
server.js
   ├─ importa → authorRoutes.js
   ├─ importa → AuthorController.js
   ├─ importa → AuthorService.js
   ├─ importa → AuthorRepository.js
   └─ importa → Author.js
```

### Conexión Lógica (Flujo de Datos)

```
Cliente
   ↓ HTTP Request
Express (server.js)
   ↓ Busca ruta
Rutas (authorRoutes.js)
   ↓ Ejecuta método
Controlador (AuthorController.js)
   ↓ Llama servicio
Servicio (AuthorService.js)
   ↓ Usa repositorio
Repositorio (AuthorRepository.js)
   ↓ Guarda/busca
Datos (Map en memoria)
   ↓ Retorna
Cliente
   ↓ HTTP Response
```

### Conexión de Responsabilidades

```
HTTP          → Controlador
Lógica        → Servicio
Datos         → Repositorio
Modelo        → Entidad
Orquestación  → server.js
Mapeo URLs    → Rutas
```

## 🚀 Conclusión

**El servidor es como un empleado que:**
1. Nunca duerme (se queda corriendo)
2. Espera que le pidas algo (peticiones HTTP)
3. Procesa tu pedido (ejecuta código)
4. Te responde (envía JSON)
5. Vuelve a esperar

**Las piezas se conectan así:**
- server.js crea todo y conecta las piezas
- Rutas mapean URLs a métodos
- Controladores manejan HTTP
- Servicios aplican lógica
- Repositorios guardan datos
- Entidades modelan el dominio

**Todo fluye en cadena:**
Cliente → Express → Rutas → Controlador → Servicio → Repositorio → Datos
