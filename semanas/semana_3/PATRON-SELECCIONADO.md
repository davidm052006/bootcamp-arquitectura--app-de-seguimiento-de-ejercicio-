# ADR-003: Selección de Patrón Arquitectónico para FitWell

## Estado

✅ **Aceptado**

## Fecha

Febrero 2026

---

## Contexto

### Descripción del Dominio

FitWell es una aplicación de fitness y nutrición que permite a los usuarios:

- Entrenar desde casa con rutinas adaptadas a su equipamiento disponible
- Seguir planes de alimentación personalizados según morfología e IMC
- Registrar progreso y visualizar estadísticas
- Recibir notificaciones configurables
- Acceder a contenido accesible (subtítulos, screen readers)

### Requisitos Identificados

#### Funcionales

- Gestión de usuarios y autenticación
- CRUD de equipamiento personal
- Catálogo de ejercicios filtrable por equipo
- Creación y seguimiento de rutinas
- Registro de entrenamientos y comidas
- Dashboard con gráficos de progreso
- Sistema de notificaciones configurables
- Soporte de accesibilidad básica

#### No Funcionales

| Requisito          | Nivel Requerido | Justificación                                                            |
| ------------------ | --------------- | ------------------------------------------------------------------------ |
| **Escalabilidad**  | Medio           | Inicio con pocos usuarios (~100-500), crecimiento gradual esperado       |
| **Performance**    | Medio           | Respuestas < 2s aceptables, no es tiempo real crítico                    |
| **Mantenibilidad** | Alto            | Equipo pequeño (1-2 devs), código debe ser fácil de entender y modificar |
| **Disponibilidad** | Medio           | 99% uptime suficiente, no es crítico 24/7                                |
| **Seguridad**      | Alto            | Maneja datos personales (peso, altura, salud), requiere protección       |

### Restricciones

- **Equipo**: 1-2 desarrolladores junior/mid-level
- **Tiempo**: 8 semanas para MVP
- **Presupuesto**: Limitado (hosting gratuito/económico)
- **Tecnología**:
  - Backend: Spring Boot (Java) - Requerido por bootcamp
  - Frontend: React + TypeScript
  - Base de datos: PostgreSQL

---

## Opciones Evaluadas

### Opción 1: Arquitectura en N-Capas (Layered Architecture)

**Descripción**:
Organiza el sistema en capas horizontales donde cada capa tiene una responsabilidad específica y solo puede comunicarse con la capa inmediatamente inferior.

**Capas típicas:**

1. Presentación (UI)
2. Lógica de Negocio (Services)
3. Acceso a Datos (Repositories)
4. Base de Datos

**Pros:**

- ✅ Simple de entender e implementar
- ✅ Separación clara de responsabilidades
- ✅ Ideal para equipos pequeños
- ✅ Bien soportada por Spring Boot
- ✅ Fácil de mantener y testear
- ✅ Curva de aprendizaje baja
- ✅ Amplia documentación y ejemplos

**Contras:**

- ❌ Puede volverse monolítica si crece mucho
- ❌ Acoplamiento entre capas si no se usa bien
- ❌ Menos flexible para cambios grandes
- ❌ No ideal para sistemas distribuidos

---

### Opción 2: Arquitectura Hexagonal (Ports & Adapters)

**Descripción**:
Coloca la lógica de negocio en el centro, rodeada de puertos (interfaces) y adaptadores (implementaciones) que permiten conectar con el mundo exterior.

**Componentes:**

- Dominio (centro)
- Puertos (interfaces)
- Adaptadores (implementaciones)
- Infraestructura (externa)

**Pros:**

- ✅ Dominio completamente independiente
- ✅ Muy testeable (fácil usar mocks)
- ✅ Flexible para cambiar tecnologías
- ✅ Excelente para DDD (Domain-Driven Design)
- ✅ Inversión de dependencias perfecta

**Contras:**

- ❌ Más compleja de implementar
- ❌ Curva de aprendizaje alta
- ❌ Puede ser over-engineering para proyectos simples
- ❌ Más código boilerplate
- ❌ Requiere experiencia en DDD

---

### Opción 3: Arquitectura de Microservicios

**Descripción**:
Divide el sistema en servicios pequeños e independientes que se comunican por red (HTTP, mensajería).

**Servicios potenciales:**

- Servicio de Usuarios
- Servicio de Ejercicios
- Servicio de Rutinas
- Servicio de Nutrición
- Servicio de Notificaciones

**Pros:**

- ✅ Escalabilidad independiente por servicio
- ✅ Tecnologías diferentes por servicio
- ✅ Despliegue independiente
- ✅ Tolerancia a fallos aislada
- ✅ Equipos independientes

**Contras:**

- ❌ Complejidad operacional muy alta
- ❌ Requiere DevOps avanzado
- ❌ Latencia de red entre servicios
- ❌ Debugging más difícil
- ❌ Overhead de infraestructura
- ❌ Overkill para MVP pequeño

---

## Decisión

Hemos decidido usar **Arquitectura en N-Capas (Layered Architecture)** para el sistema FitWell.

### Justificación Principal

La arquitectura en capas es la opción más adecuada para FitWell porque:

1. **Simplicidad**: Con un equipo de 1-2 desarrolladores y 8 semanas de plazo, necesitamos una arquitectura que permita avanzar rápido sin complejidad innecesaria.

2. **Mantenibilidad**: La separación clara en capas (Presentación, Negocio, Datos) facilita que cualquier desarrollador entienda el código rápidamente.

3. **Soporte de Spring Boot**: Spring Boot está diseñado para arquitecturas en capas, con anotaciones como `@Controller`, `@Service`, `@Repository` que mapean directamente a las capas.

4. **Escalabilidad Suficiente**: Para 100-500 usuarios iniciales, una aplicación monolítica bien estructurada es más que suficiente. Podemos escalar verticalmente si es necesario.

5. **Bajo Riesgo**: Es un patrón probado y maduro, con abundante documentación y ejemplos.

### Resultado de la Matriz de Decisión

| Criterio                          | Peso | N-Capas         | Hexagonal       | Microservicios  |
| --------------------------------- | ---- | --------------- | --------------- | --------------- |
| **Simplicidad de Implementación** | 25%  | 10 × 0.25 = 2.5 | 6 × 0.25 = 1.5  | 3 × 0.25 = 0.75 |
| **Mantenibilidad**                | 25%  | 9 × 0.25 = 2.25 | 8 × 0.25 = 2.0  | 5 × 0.25 = 1.25 |
| **Adecuación al Equipo**          | 20%  | 10 × 0.20 = 2.0 | 6 × 0.20 = 1.2  | 4 × 0.20 = 0.8  |
| **Escalabilidad**                 | 15%  | 6 × 0.15 = 0.9  | 7 × 0.15 = 1.05 | 10 × 0.15 = 1.5 |
| **Testabilidad**                  | 15%  | 8 × 0.15 = 1.2  | 10 × 0.15 = 1.5 | 7 × 0.15 = 1.05 |
| **TOTAL**                         | 100% | **8.85**        | **7.25**        | **5.35**        |

**Ganador**: Arquitectura en N-Capas con 8.85 puntos

---

## Consecuencias

### Positivas

- ✅ Desarrollo rápido del MVP en 8 semanas
- ✅ Código fácil de entender para nuevos desarrolladores
- ✅ Despliegue simple (un solo artefacto)
- ✅ Debugging sencillo (todo en un proceso)
- ✅ Bajo costo de infraestructura
- ✅ Testing straightforward (unit + integration)

### Negativas (Trade-offs Aceptados)

- ⚠️ Escalabilidad limitada a escala vertical
- ⚠️ Acoplamiento entre capas si no se aplica SOLID
- ⚠️ Migración a microservicios requeriría refactoring significativo
- ⚠️ Toda la aplicación debe desplegarse junta

### Riesgos y Mitigación

| Riesgo                                                | Probabilidad | Impacto | Mitigación                                                                             |
| ----------------------------------------------------- | ------------ | ------- | -------------------------------------------------------------------------------------- |
| **Acoplamiento excesivo entre capas**                 | Medio        | Alto    | Aplicar SOLID estrictamente, usar interfaces, inyección de dependencias                |
| **Crecimiento descontrolado de la capa de servicios** | Medio        | Medio   | Dividir servicios por dominio, aplicar SRP, revisar código regularmente                |
| **Dificultad para escalar horizontalmente**           | Bajo         | Medio   | Diseñar con stateless en mente, usar caché externa (Redis), preparar para contenedores |
| **Performance de base de datos**                      | Bajo         | Medio   | Indexar correctamente, usar paginación, implementar caché de queries                   |

---

## Diagrama de Arquitectura

Ver [diagrama-arquitectura.md](./diagrama-arquitectura.md) para el diagrama completo.

**Resumen de capas:**

```
┌─────────────────────────────────────────────────────────┐
│                  CAPA DE PRESENTACIÓN                   │
│              (React + TypeScript + Tailwind)            │
│  - Componentes UI                                       │
│  - Gestión de estado local (Context API)               │
│  - Llamadas a API (React Query)                        │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/REST + JWT
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   CAPA DE API REST                      │
│                  (Spring Boot Controllers)              │
│  - Validación de entrada                               │
│  - Autenticación/Autorización                          │
│  - Serialización JSON                                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              CAPA DE LÓGICA DE NEGOCIO                  │
│                  (Spring Services)                      │
│  - EquipmentService                                     │
│  - RoutineService                                       │
│  - UserService                                          │
│  - NutritionService                                     │
│  - NotificationService                                  │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              CAPA DE ACCESO A DATOS                     │
│            (Spring Data JPA Repositories)               │
│  - EquipmentRepository                                  │
│  - RoutineRepository                                    │
│  - UserRepository                                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   BASE DE DATOS                         │
│                    (PostgreSQL)                         │
│  - Tablas normalizadas                                 │
│  - Índices optimizados                                 │
│  - Constraints de integridad                           │
└─────────────────────────────────────────────────────────┘
```

---

## Notas Adicionales

### Próximos Pasos (Semana 4)

1. Diseñar API REST con endpoints específicos
2. Definir DTOs (Data Transfer Objects)
3. Especificar contratos de cada endpoint
4. Documentar con OpenAPI/Swagger
5. Definir estructura de base de datos

### Referencias

- **Libros**:
  - "Clean Architecture" - Robert C. Martin
  - "Patterns of Enterprise Application Architecture" - Martin Fowler
- **Artículos**:
  - Spring Boot Layered Architecture Best Practices
  - Microservices vs Monolith: When to Use What
- **Documentación**:
  - Spring Boot Official Documentation
  - PostgreSQL Performance Tuning Guide

### Decisiones Relacionadas

- ADR-001: Selección de caso de estudio (Semana 1)
- ADR-002: Aplicación de principios SOLID (Semana 2)
- ADR-004: Diseño de APIs (Semana 4) - Pendiente

---

**Autor:** David  
**Fecha de Creación:** Febrero 2026  
**Última Actualización:** Febrero 2026
