# FitWell – Proyecto Bootcamp

**Autor:** David
**Bootcamp:** Arquitectura de Software – SENA
**Fecha:** Febrero 2026

---

## 1️⃣ Problema que Resuelve

Muchas personas desean **entrenar** y mejorar su **alimentación** desde casa, pero se frustran porque las rutinas y planes disponibles no consideran el **equipo real** que poseen (mancuernas, colchoneta, cuerda, saco de boxeo, barra, bandas elásticas o solo peso corporal). Además, la mayoría de aplicaciones son demasiado genéricas: no adaptan ejercicios ni alimentación al **tipo de cuerpo (morfología)**, al **IMC** ni al contexto real del usuario.

A esto se suma que pocas aplicaciones ofrecen una experiencia **accesible**, con animaciones claras, explicaciones comprensibles y **notificaciones configurables** que no resulten invasivas.

**FitWell** soluciona este problema mediante un sistema integral que:

* Pregunta qué **equipamiento** tiene el usuario en casa y permite actualizarlo en cualquier momento.
* Adapta automáticamente las **rutinas de ejercicio** y sugerencias de alimentación según el equipamiento, el IMC y la morfología.
* Ofrece recomendaciones visuales con **animaciones**, notificaciones personalizables y soporte básico de **accesibilidad** para personas sordas o ciegas.

Esto permite que cualquier persona, sin importar su presupuesto o espacio, pueda entrenar y alimentarse de forma coherente, sostenible y realista.

---

## 2️⃣ Usuarios Principales

### Usuario que entrena en casa

* Registra su equipamiento disponible.
* Sigue rutinas adaptadas a su morfología y equipo.
* Registra entrenamientos y comidas.
* Visualiza su progreso (IMC, medidas, rendimiento).
* Recibe recomendaciones claras con animaciones.
* Configura notificaciones según sus preferencias.

### Usuario con necesidades de accesibilidad

* Personas sordas o ciegas.
* Uso de subtítulos en animaciones.
* Texto alternativo claro.
* Compatibilidad con lectores de pantalla.
* Navegación sencilla y comprensible.

---

## 3️⃣ Funcionalidades Principales

* Registro e inicio de sesión con perfil completo (datos morfológicos, peso, altura, objetivo y equipamiento disponible).
* Gestión y actualización del equipamiento del usuario.
* Catálogo de ejercicios y alimentos con filtros automáticos según equipamiento.
* Creación de rutinas de entrenamiento y planes de alimentación adaptados a IMC y morfología.
* Registro diario de entrenamientos y comidas con feedback inmediato.
* Dashboard con gráficos de progreso, recomendaciones personalizadas y animaciones explicativas.
* Notificaciones inteligentes configurables (horarios, frecuencia y tipo).
* Soporte básico de accesibilidad (subtítulos y compatibilidad con screen readers).

---

## 4️⃣ Decisiones Iniciales

### Metodología de Desarrollo

**Scrum**

Se eligió Scrum porque permite:

* Entregar valor de forma incremental cada dos semanas.
* Priorizar funcionalidades esenciales (perfil, equipamiento y catálogo).
* Adaptar el alcance si partes complejas (como animaciones o personalización avanzada) requieren más tiempo.

### Arquitectura del Sistema

**Arquitectura en N-Capas (Layered Architecture)**

Se eligió este enfoque porque:

* Permite una separación clara entre presentación, lógica de negocio y acceso a datos.
* Facilita el mantenimiento y la escalabilidad.
* Es ideal para proyectos académicos y profesionales de tamaño medio.

Capas principales:

* Presentación (Frontend).
* Lógica de negocio (Servicios).
* Acceso a datos (Repositorios y entidades).

---

## 5️⃣ Tecnologías

### Backend

* **Spring Boot (Java – POO)**
* **Spring Security** para autenticación y autorización.
* **Spring Data JPA + Hibernate** para persistencia.

### Base de Datos

* **PostgreSQL**, por su robustez, soporte relacional y compatibilidad con JSON.

### Frontend

* **React + TypeScript** (cliente independiente consumiendo API REST).
* **TailwindCSS + shadcn/ui** para diseño moderno y consistente.
* **Framer Motion** para animaciones fluidas.
* **React Query** para manejo de estado remoto y caché.

### Autenticación

* **JWT (JSON Web Tokens)**.

### Deploy

* Backend: Railway / Render / Fly.io.
* Frontend: Vercel / Netlify.
* Base de datos: Railway PostgreSQL o Supabase (plan gratuito).

---

## 6️⃣ Alcance Inicial del MVP

* Registro e inicio de sesión.
* Gestión de perfil y equipamiento.
* Catálogo básico de ejercicios.
* Rutinas simples adaptadas al equipo disponible.
* Dashboard básico de progreso.

Este MVP permitirá validar la idea y sentar las bases para futuras mejoras.
---

## 7️⃣ Diagrama de Arquitectura

```mermaid
graph TD
    subgraph Frontend[Frontend - Capa de Presentacion]
        A[React TypeScript] --> B[TailwindCSS y shadcn ui]
        A --> C[Framer Motion Animaciones]
        A --> D[React Query y Context API]
    end

    subgraph Backend[Backend - Capa API y Logica]
        E[Spring Boot Java] --> F[Controladores REST]
        E --> G[Spring Security JWT]
        E --> H[Servicios Logica de Negocio]
        H --> I[Spring Data JPA]
    end

    subgraph Datos[Capa de Acceso a Datos]
        I --> J[PostgreSQL]
    end

    Frontend -->|API REST con JWT| Backend
    Backend -->|JPA Hibernate| Datos
