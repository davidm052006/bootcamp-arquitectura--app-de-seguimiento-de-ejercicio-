# Aplicación de Principios SOLID en FitWell

**Autor:** David  
**Bootcamp:** Arquitectura de Software – SENA  
**Semana:** 2  
**Fecha:** Febrero 2026

---

## 📋 Índice

1. [Introducción](#introducción)
2. [Single Responsibility Principle (SRP)](#1-single-responsibility-principle-srp)
3. [Open/Closed Principle (OCP)](#2-openclosed-principle-ocp)
4. [Liskov Substitution Principle (LSP)](#3-liskov-substitution-principle-lsp)
5. [Interface Segregation Principle (ISP)](#4-interface-segregation-principle-isp)
6. [Dependency Inversion Principle (DIP)](#5-dependency-inversion-principle-dip)
7. [Conclusiones](#conclusiones)

---

## Introducción

Este documento explica cómo se aplicaron los 5 principios SOLID en el módulo de gestión de equipamiento y rutinas de FitWell. Cada principio resuelve un problema arquitectónico específico y mejora la mantenibilidad, escalabilidad y testabilidad del código.

---

## 1. Single Responsibility Principle (SRP)

> "Una clase debe tener una sola razón para cambiar"

### SRP en FitWell

| Responsabilidad                  | Clase                       | Razón de Cambio                                    | Ubicación                                              |
| -------------------------------- | --------------------------- | -------------------------------------------------- | ------------------------------------------------------ |
| **Representar datos del equipo** | `Equipment`                 | Cambios en atributos del equipamiento              | `src/domain/entities/Equipment.js`                     |
| **Persistencia de equipos**      | `MemoryEquipmentRepository` | Cambio de base de datos (memoria → PostgreSQL)     | `src/domain/repositories/MemoryEquipmentRepository.js` |
| **Lógica de negocio de equipos** | `EquipmentService`          | Nuevas reglas de negocio (ej: validar stock)       | `src/domain/services/EquipmentService.js`              |
| **Representar datos de rutina**  | `Routine`                   | Cambios en atributos de rutinas                    | `src/domain/entities/Routine.js`                       |
| **Persistencia de rutinas**      | `MemoryRoutineRepository`   | Cambio de base de datos                            | `src/domain/repositories/MemoryRoutineRepository.js`   |
| **Lógica de negocio de rutinas** | `RoutineService`            | Nuevas reglas (ej: validar equipamiento requerido) | `src/domain/services/RoutineService.js`                |

### Ejemplo de Aplicación

#### ❌ Sin SRP (Todo en una clase)

```javascript
class Equipment {
  constructor(id, nombre, tipo) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
  }

  // ❌ Responsabilidad 1: Datos
  getNombre() {
    return this.nombre;
  }

  // ❌ Responsabilidad 2: Validación
  validate() {
    if (!this.nombre) throw new Error("Nombre requerido");
  }

  // ❌ Responsabilidad 3: Persistencia
  save() {
    database.insert(this);
  }

  // ❌ Responsabilidad 4: Presentación
  toHTML() {
    return `<div>${this.nombre}</div>`;
  }
}
```

**Problemas:**

- Si cambio la base de datos, debo modificar Equipment
- Si cambio la validación, debo modificar Equipment
- Si cambio el HTML, debo modificar Equipment
- **4 razones para cambiar = Viola SRP**

#### ✅ Con SRP (Responsabilidades separadas)

```javascript
// Responsabilidad 1: Solo datos y lógica del dominio
class Equipment {
  constructor(id, nombre, tipo) {
    this.id = id;
    this.nombre = nombre;
    this.tipo = tipo;
  }

  getNombre() {
    return this.nombre;
  }
  marcarComoNoDisponible() {
    this.disponible = false;
  }
}

// Responsabilidad 2: Solo persistencia
class MemoryEquipmentRepository {
  save(equipment) {
    /* guardar en memoria */
  }
  findById(id) {
    /* buscar en memoria */
  }
}

// Responsabilidad 3: Solo lógica de negocio
class EquipmentService {
  addEquipment(nombre, tipo) {
    /* crear y guardar */
  }
  listEquipment() {
    /* listar todos */
  }
}
```

**Ventajas:**

- ✅ Cada clase tiene UNA sola razón para cambiar
- ✅ Fácil de mantener y testear
- ✅ Cambios aislados (cambiar BD no afecta Equipment)

### Problema Arquitectónico que Resuelve

**Problema:** Clases "Dios" que hacen demasiadas cosas, difíciles de mantener y testear.

**Solución:** Separar responsabilidades en clases cohesivas y especializadas.

---

## 2. Open/Closed Principle (OCP)

> "Las clases deben estar abiertas para extensión, pero cerradas para modificación"

### OCP en FitWell

| Componente Base           | Extensiones                                               | Ubicación                             |
| ------------------------- | --------------------------------------------------------- | ------------------------------------- |
| `Repository` (clase base) | `MemoryEquipmentRepository`, `MemoryRoutineRepository`    | `src/domain/interfaces/Repository.js` |
| Futuro: `Repository`      | `PostgresEquipmentRepository`, `MongoEquipmentRepository` | (No implementado aún)                 |

### Ejemplo de Aplicación

#### ❌ Sin OCP (Modificar código existente)

```javascript
class EquipmentService {
  saveToMemory(equipment) {
    // Guardar en memoria
  }

  // ❌ Para agregar PostgreSQL, debo MODIFICAR la clase
  saveToPostgres(equipment) {
    // Guardar en PostgreSQL
  }

  // ❌ Para agregar MongoDB, debo MODIFICAR la clase nuevamente
  saveToMongo(equipment) {
    // Guardar en MongoDB
  }
}
```

**Problema:** Cada nueva base de datos requiere modificar `EquipmentService`.

#### ✅ Con OCP (Extender sin modificar)

```javascript
// Clase base CERRADA para modificación
export class Repository {
  save(entity) {
    throw new Error("Implementar save()");
  }
}

// Extensión 1: ABIERTA para extensión
export class MemoryEquipmentRepository extends Repository {
  save(equipment) {
    // Implementación en memoria
  }
}

// Extensión 2: Nueva funcionalidad SIN modificar Repository
export class PostgresEquipmentRepository extends Repository {
  save(equipment) {
    // Implementación en PostgreSQL
  }
}

// Extensión 3: Otra nueva funcionalidad SIN modificar nada anterior
export class MongoEquipmentRepository extends Repository {
  save(equipment) {
    // Implementación en MongoDB
  }
}
```

**Ventajas:**

- ✅ Agregar nuevas bases de datos sin tocar código existente
- ✅ No hay riesgo de romper funcionalidad existente
- ✅ Fácil de extender

### Problema Arquitectónico que Resuelve

**Problema:** Cada nueva funcionalidad requiere modificar código existente, aumentando el riesgo de bugs.

**Solución:** Usar herencia/composición para extender funcionalidad sin modificar código base.

---

## 3. Liskov Substitution Principle (LSP)

> "Los objetos de una clase derivada deben poder sustituir a objetos de la clase base sin alterar el comportamiento del programa"

### LSP en FitWell

| Clase Base   | Clases Derivadas                                       | Sustituibilidad                                |
| ------------ | ------------------------------------------------------ | ---------------------------------------------- |
| `Repository` | `MemoryEquipmentRepository`, `MemoryRoutineRepository` | ✅ Cualquier Repository puede sustituir a otro |

### Ejemplo de Aplicación

#### ✅ Con LSP (Sustitución correcta)

```javascript
// Clase base define el contrato
class Repository {
  save(entity) {
    throw new Error("Implementar");
  }
  findById(id) {
    throw new Error("Implementar");
  }
}

// Implementación 1: Cumple el contrato
class MemoryEquipmentRepository extends Repository {
  save(entity) {
    // ✅ Retorna la entidad guardada (cumple contrato)
    return entity;
  }

  findById(id) {
    // ✅ Retorna entidad o null (cumple contrato)
    return this.data.get(id) || null;
  }
}

// Implementación 2: También cumple el contrato
class PostgresEquipmentRepository extends Repository {
  save(entity) {
    // ✅ Retorna la entidad guardada (cumple contrato)
    return entity;
  }

  findById(id) {
    // ✅ Retorna entidad o null (cumple contrato)
    return this.query(id) || null;
  }
}

// Uso: Puedo sustituir sin problemas
function testRepository(repository) {
  const equipment = new Equipment("1", "Mancuernas", "PESO_LIBRE");
  repository.save(equipment); // ✅ Funciona con cualquier Repository
  const found = repository.findById("1"); // ✅ Funciona con cualquier Repository
}

testRepository(new MemoryEquipmentRepository()); // ✅ Funciona
testRepository(new PostgresEquipmentRepository()); // ✅ Funciona
```

#### ❌ Violación de LSP

```javascript
class BadRepository extends Repository {
  save(entity) {
    // ❌ Lanza excepción en lugar de retornar
    throw new Error("No implementado");
  }

  findById(id) {
    // ❌ Retorna string en lugar de objeto
    return "No encontrado";
  }
}

// ❌ Esto rompe el código que espera un Repository
testRepository(new BadRepository()); // 💥 Falla
```

### Problema Arquitectónico que Resuelve

**Problema:** Implementaciones que no cumplen el contrato rompen el código que las usa.

**Solución:** Todas las implementaciones deben cumplir el contrato de la clase base.

---

## 4. Interface Segregation Principle (ISP)

> "Los clientes no deben depender de interfaces que no usan"

### ISP en FitWell

| Interfaz     | Métodos                                         | Usado Por              |
| ------------ | ----------------------------------------------- | ---------------------- |
| `Repository` | `save()`, `findById()`, `findAll()`, `delete()` | Todos los repositorios |

### Ejemplo de Aplicación

#### ❌ Sin ISP (Interfaz "gorda")

```javascript
// ❌ Interfaz con demasiados métodos
class SuperRepository {
  save(entity) {}
  findById(id) {}
  findAll() {}
  delete(id) {}
  export() {} // No todos lo necesitan
  import() {} // No todos lo necesitan
  backup() {} // No todos lo necesitan
  restore() {} // No todos lo necesitan
  sendEmail() {} // ¿Qué hace esto aquí?
}

// ❌ MemoryRepository debe implementar TODO, aunque no lo use
class MemoryEquipmentRepository extends SuperRepository {
  save(entity) {
    /* implementado */
  }
  findById(id) {
    /* implementado */
  }

  // ❌ Obligado a implementar cosas que no necesita
  export() {
    throw new Error("No soportado");
  }
  import() {
    throw new Error("No soportado");
  }
  backup() {
    throw new Error("No soportado");
  }
  sendEmail() {
    throw new Error("¿Por qué esto está aquí?");
  }
}
```

#### ✅ Con ISP (Interfaces específicas)

```javascript
// ✅ Interfaz básica con solo lo esencial
class Repository {
  save(entity) {}
  findById(id) {}
  findAll() {}
  delete(id) {}
}

// ✅ Interfaz específica para exportación (opcional)
class ExportableRepository extends Repository {
  export() {}
  import() {}
}

// ✅ Implementación simple: solo lo básico
class MemoryEquipmentRepository extends Repository {
  save(entity) {
    /* implementado */
  }
  findById(id) {
    /* implementado */
  }
  findAll() {
    /* implementado */
  }
  delete(id) {
    /* implementado */
  }
  // ✅ No necesita implementar export/import
}

// ✅ Implementación avanzada: con exportación
class PostgresEquipmentRepository extends ExportableRepository {
  save(entity) {
    /* implementado */
  }
  findById(id) {
    /* implementado */
  }
  export() {
    /* implementado */
  }
  import() {
    /* implementado */
  }
}
```

### Problema Arquitectónico que Resuelve

**Problema:** Clases obligadas a implementar métodos que no necesitan.

**Solución:** Interfaces pequeñas y específicas, cada clase implementa solo lo que necesita.

---

## 5. Dependency Inversion Principle (DIP)

> "Depende de abstracciones, no de implementaciones concretas"

### DIP en FitWell

| Clase de Alto Nivel | Depende de (Abstracción) | Implementación Concreta     |
| ------------------- | ------------------------ | --------------------------- |
| `EquipmentService`  | `Repository`             | `MemoryEquipmentRepository` |
| `RoutineService`    | `Repository`             | `MemoryRoutineRepository`   |

### Ejemplo de Aplicación

#### ❌ Sin DIP (Dependencia directa)

```javascript
// ❌ Servicio depende de implementación concreta
class EquipmentService {
  constructor() {
    // ❌ Crea su propia dependencia (acoplamiento fuerte)
    this.repository = new MemoryEquipmentRepository();
  }

  addEquipment(nombre, tipo) {
    const equipment = new Equipment(id, nombre, tipo);
    return this.repository.save(equipment);
  }
}

// ❌ Problemas:
// - No puedo cambiar a PostgreSQL sin modificar EquipmentService
// - No puedo testear con un repositorio falso
// - Acoplamiento fuerte
```

#### ✅ Con DIP (Inyección de dependencias)

```javascript
// ✅ Servicio depende de abstracción
class EquipmentService {
  constructor(repository) {
    // ← Recibe abstracción (Repository)
    this.repository = repository;
  }

  addEquipment(nombre, tipo) {
    const equipment = new Equipment(id, nombre, tipo);
    return this.repository.save(equipment); // ← Usa abstracción
  }
}

// ✅ Uso en producción: inyectar implementación real
const memoryRepo = new MemoryEquipmentRepository();
const service = new EquipmentService(memoryRepo);

// ✅ Uso en tests: inyectar implementación falsa
class FakeRepository extends Repository {
  save(entity) {
    return entity;
  }
}
const fakeRepo = new FakeRepository();
const testService = new EquipmentService(fakeRepo);

// ✅ Cambiar a PostgreSQL: solo cambiar la inyección
const postgresRepo = new PostgresEquipmentRepository();
const prodService = new EquipmentService(postgresRepo);
```

### Diagrama de Dependencias

```
┌─────────────────────────────────────────┐
│     EquipmentService (Alto Nivel)       │
│                                         │
│  - addEquipment()                       │
│  - listEquipment()                      │
└─────────────────────────────────────────┘
                    │
                    │ depende de
                    ▼
┌─────────────────────────────────────────┐
│     Repository (Abstracción)            │
│                                         │
│  - save()                               │
│  - findAll()                            │
└─────────────────────────────────────────┘
                    ▲
                    │ implementa
        ┌───────────┴───────────┐
        │                       │
┌───────────────────┐  ┌────────────────────┐
│ MemoryEquipment   │  │ PostgresEquipment  │
│ Repository        │  │ Repository         │
│ (Bajo Nivel)      │  │ (Bajo Nivel)       │
└───────────────────┘  └────────────────────┘
```

### Problema Arquitectónico que Resuelve

**Problema:** Cambiar implementaciones requiere modificar clases de alto nivel.

**Solución:** Inyectar dependencias, permitiendo cambiar implementaciones sin tocar código de alto nivel.

---

## Conclusiones

### Beneficios Obtenidos

1. **Mantenibilidad:** Cada clase tiene una responsabilidad clara (SRP)
2. **Extensibilidad:** Puedo agregar nuevas funcionalidades sin modificar código existente (OCP)
3. **Flexibilidad:** Puedo cambiar implementaciones fácilmente (DIP)
4. **Testabilidad:** Puedo inyectar dependencias falsas para tests (DIP)
5. **Robustez:** Las implementaciones cumplen contratos (LSP)
6. **Simplicidad:** Interfaces pequeñas y específicas (ISP)

### Comparación: Sin SOLID vs Con SOLID

| Aspecto                | Sin SOLID                           | Con SOLID                  |
| ---------------------- | ----------------------------------- | -------------------------- |
| **Cambiar BD**         | Modificar múltiples clases          | Solo cambiar inyección     |
| **Agregar validación** | Modificar entidad                   | Crear clase Validator      |
| **Testing**            | Difícil (dependencias hardcodeadas) | Fácil (inyección de mocks) |
| **Mantenimiento**      | Alto acoplamiento                   | Bajo acoplamiento          |
| **Escalabilidad**      | Limitada                            | Alta                       |

### Próximos Pasos

1. Implementar validadores (SRP)
2. Agregar más repositorios (OCP)
3. Crear tests unitarios (DIP)
4. Implementar PostgreSQL (OCP + DIP)

---

**Fecha de Creación:** Febrero 2026  
**Última Actualización:** Febrero 2026
