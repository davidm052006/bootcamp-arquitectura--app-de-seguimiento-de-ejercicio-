# FitWell - Semana 2: Principios SOLID

**Autor:** David  
**Bootcamp:** Arquitectura de Software – SENA  
**Tema:** Aplicación de Principios SOLID en JavaScript  
**Fecha:** Febrero 2026

---

## 📋 Descripción

Implementación de los 5 principios SOLID en el dominio de FitWell, enfocándose en el módulo de gestión de equipamiento y rutinas de entrenamiento.

Este proyecto demuestra cómo aplicar arquitectura limpia y principios de diseño orientado a objetos en JavaScript vanilla.

---

## 🎯 Objetivos de Aprendizaje

- ✅ Aplicar Single Responsibility Principle (SRP)
- ✅ Aplicar Open/Closed Principle (OCP)
- ✅ Aplicar Liskov Substitution Principle (LSP)
- ✅ Aplicar Interface Segregation Principle (ISP)
- ✅ Aplicar Dependency Inversion Principle (DIP)
- ✅ Implementar patrón Repository
- ✅ Usar inyección de dependencias
- ✅ Separar responsabilidades en capas

---

## 📁 Estructura del Proyecto

```
semanas/semana_2/
├── package.json                    # Configuración del proyecto
├── README.md                       # Este archivo
├── SOLID-APLICADO.md              # Documentación de aplicación de SOLID
│
├── src/domain/
│   ├── entities/                  # Entidades del dominio
│   │   ├── Equipment.js           # Entidad Equipamiento
│   │   ├── Routine.js             # Entidad Rutina
│   │   └── User.js                # Entidad Usuario (futuro)
│   │
│   ├── interfaces/                # Contratos/Abstracciones
│   │   └── Repository.js          # Contrato base para repositorios
│   │
│   ├── repositories/              # Implementaciones de persistencia
│   │   ├── MemoryEquipmentRepository.js
│   │   └── MemoryRoutineRepository.js
│   │
│   ├── services/                  # Lógica de negocio
│   │   ├── EquipmentService.js    # Servicio de equipamiento
│   │   └── RoutineService.js      # Servicio de rutinas
│   │
│   └── index.js                   # Punto de entrada (demo)
│
└── tests/                         # Tests (opcional)
    └── EquipmentService.test.js
```

---

## 🚀 Instalación y Ejecución

### Requisitos Previos

- Node.js instalado (versión 14 o superior)
- Editor de código (VS Code recomendado)

### Pasos

1. **Navegar a la carpeta del proyecto:**

   ```bash
   cd semanas/semana_2
   ```

2. **Ejecutar el proyecto:**

   ```bash
   node src/domain/index.js
   ```

3. **Ver la salida en consola:**
   El programa mostrará ejemplos de:
   - Creación de equipos
   - Listado de equipos
   - Activación de rutinas
   - Estado de rutina activa

---

## 📚 Funcionalidades Implementadas

### Módulo de Equipamiento

- ✅ Crear equipos de ejercicio
- ✅ Listar todos los equipos
- ✅ Buscar equipo por ID
- ✅ Eliminar equipo
- ✅ Marcar equipo como disponible/no disponible

### Módulo de Rutinas

- ✅ Listar rutinas disponibles
- ✅ Activar una rutina
- ✅ Ver rutina activa
- ✅ Desactivar rutina

---

## 🎓 Conceptos Aplicados

### 1. Single Responsibility Principle (SRP)

Cada clase tiene una única responsabilidad:

- `Equipment` → Solo datos y lógica del equipo
- `MemoryEquipmentRepository` → Solo persistencia
- `EquipmentService` → Solo lógica de negocio

### 2. Open/Closed Principle (OCP)

El sistema está abierto para extensión, cerrado para modificación:

- `Repository` es la clase base
- Puedo agregar `PostgresRepository` sin modificar código existente

### 3. Liskov Substitution Principle (LSP)

Cualquier implementación de `Repository` puede sustituir a otra:

```javascript
// Funciona con cualquier Repository
const service = new EquipmentService(repository);
```

### 4. Interface Segregation Principle (ISP)

`Repository` tiene solo métodos esenciales:

- `save()`, `findById()`, `findAll()`, `delete()`

### 5. Dependency Inversion Principle (DIP)

Los servicios dependen de abstracciones, no de implementaciones:

```javascript
// ✅ Depende de Repository (abstracción)
class EquipmentService {
  constructor(repository) {
    this.repository = repository;
  }
}
```

---

## 💻 Ejemplos de Uso

### Crear y Listar Equipos

```javascript
import { MemoryEquipmentRepository } from "./repositories/MemoryEquipmentRepository.js";
import { EquipmentService } from "./services/EquipmentService.js";

// Crear instancias
const repository = new MemoryEquipmentRepository();
const service = new EquipmentService(repository);

// Agregar equipos
service.addEquipment("Mancuernas", "PESO_LIBRE");
service.addEquipment("Colchoneta", "ACCESORIO");
service.addEquipment("Cuerda", "CARDIO");

// Listar todos
const equipos = service.listEquipment();
console.log("Equipos disponibles:", equipos);
```

### Activar Rutina

```javascript
import { MemoryRoutineRepository } from "./repositories/MemoryRoutineRepository.js";
import { RoutineService } from "./services/RoutineService.js";

// Crear instancias
const repository = new MemoryRoutineRepository();
const service = new RoutineService(repository);

// Listar rutinas
const rutinas = service.listRoutines();
console.log("Rutinas disponibles:", rutinas);

// Activar una rutina
service.activateRoutine("rut-1");

// Ver rutina activa
const activa = service.getActiveRoutine();
console.log("Rutina activa:", activa);
```

---

## 📖 Documentación Adicional

- **[SOLID-APLICADO.md](./SOLID-APLICADO.md)** - Explicación detallada de cómo se aplicó cada principio SOLID
- **Código fuente** - Todos los archivos están comentados con explicaciones

---

## 🔄 Próximas Mejoras

### Semana 3 (Futuro)

- [ ] Implementar validadores (SRP)
- [ ] Agregar PostgreSQL Repository (OCP)
- [ ] Crear tests unitarios
- [ ] Implementar autenticación de usuarios
- [ ] Agregar filtros de rutinas por equipamiento

### Semana 4 (Futuro)

- [ ] Implementar API REST
- [ ] Conectar con frontend React
- [ ] Agregar sistema de notificaciones

---

## 🎯 Aprendizajes Clave

1. **Separación de responsabilidades** mejora la mantenibilidad
2. **Inyección de dependencias** facilita el testing
3. **Abstracciones** permiten cambiar implementaciones fácilmente
4. **Código limpio** es más fácil de entender y modificar
5. **SOLID** no es complicado, es sentido común aplicado

---

## 📝 Notas del Desarrollador

Este proyecto fue desarrollado como parte del bootcamp de Arquitectura de Software del SENA. El objetivo principal es aprender y aplicar principios de diseño orientado a objetos en un contexto real.

**Lecciones aprendidas:**

- La importancia de planificar antes de codificar
- Cómo SOLID mejora la calidad del código
- La diferencia entre entidades, repositorios y servicios
- Por qué la inyección de dependencias es poderosa

---

## 📞 Contacto

**Autor:** David  
**Bootcamp:** SENA - Arquitectura de Software  
**Año:** 2026

---

**Última actualización:** Febrero 2026
