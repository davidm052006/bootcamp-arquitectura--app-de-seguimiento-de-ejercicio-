# FitWell - Semana 3: Patrón Arquitectónico

**Autor:** David  
**Bootcamp:** Arquitectura de Software – SENA  
**Fecha:** Febrero 2026

---

## 🎯 Patrón Seleccionado

**Arquitectura en N-Capas (Layered Architecture)**

---

## 💡 Justificación en una Línea

Arquitectura en capas que separa presentación, lógica de negocio y datos, ideal para aplicaciones web con complejidad media y equipo pequeño.

---

## 📊 Diagrama de Alto Nivel

Ver [diagrama-arquitectura.md](./diagrama-arquitectura.md) para el diagrama completo de la arquitectura.

---

## 📚 Documentos

- [PATRON-SELECCIONADO.md](./PATRON-SELECCIONADO.md) - Decisión arquitectónica completa (ADR)
- [diagrama-arquitectura.md](./diagrama-arquitectura.md) - Diagrama de arquitectura con Mermaid

---

## 🏗️ Componentes Principales

### Capa de Presentación (Frontend)
- React + TypeScript
- TailwindCSS + shadcn/ui
- React Query para estado remoto

### Capa de Lógica de Negocio (Backend)
- Spring Boot (Java)
- Servicios de dominio
- Validaciones de negocio

### Capa de Acceso a Datos
- Spring Data JPA
- PostgreSQL
- Repositorios

### Capa de Integración
- API REST
- JWT para autenticación
- Validación de entrada

---

## 📈 Próximos Pasos (Semana 4)

1. Diseñar APIs REST
2. Definir contratos de componentes
3. Especificar endpoints y payloads
4. Documentar con OpenAPI/Swagger

---

**Última actualización:** Febrero 2026
