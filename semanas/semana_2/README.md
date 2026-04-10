# Semana 2: Principios SOLID en FitWell

## 📋 Objetivo

Aplicar los 5 principios SOLID en el dominio de FitWell, específicamente en el módulo de autenticación y gestión de equipamiento.

## 🏗️ Estructura del Proyecto

```
semanas/semana_2/
├── package.json
├── README.md
├── SOLID-APLICADO.md          # Documentación de aplicación de SOLID
├── src/
│   └── domain/
│       ├── entities/          # Entidades de negocio (User, Equipment)
│       ├── interfaces/        # Abstracciones (Repository)
│       ├── validators/        # Validadores (UserValidator)
│       ├── repositories/      # Implementaciones de persistencia
│       ├── services/          # Servicios de aplicación
│       └── index.js           # Punto de entrada (demo)
└── tests/
    └── AuthService.test.js    # Tests básicos
```

## 🚀 Cómo Ejecutar

### Instalación

```bash
cd semanas/semana_2
npm install
```

### Ejecutar la aplicación

```bash
npm start
```

### Ejecutar tests (opcional)

```bash
npm test
```

## 📚 Principios SOLID Aplicados

### 1. SRP (Single Responsibility Principle)

- **User.js**: Solo maneja datos y lógica de negocio del usuario
- **UserValidator.js**: Solo valida datos de usuario
- **MemoryUserRepository.js**: Solo maneja persistencia

### 2. OCP (Open/Closed Principle)

- **Repository.js**: Clase base cerrada a modificación
- Puedes crear nuevas implementaciones (PostgresRepository, MongoRepository) sin tocar el código existente

### 3. LSP (Liskov Substitution Principle)

- **MemoryUserRepository** puede sustituir a **Repository** sin romper funcionalidad

### 4. ISP (Interface Segregation Principle)

- Interfaces específicas en lugar de una interfaz "gorda"

### 5. DIP (Dependency Inversion Principle)

- **AuthService** depende de abstracciones (Repository, Validator)
- Las implementaciones concretas se inyectan por constructor

## 🎯 Funcionalidades Implementadas

- ✅ Registro de usuarios con validación
- ✅ Login de usuarios
- ✅ Gestión de equipamiento del usuario
- ✅ Cálculo de IMC
- ✅ Validación de datos morfológicos

## 📖 Documentación Adicional

Ver `SOLID-APLICADO.md` para ejemplos detallados de cada principio.
