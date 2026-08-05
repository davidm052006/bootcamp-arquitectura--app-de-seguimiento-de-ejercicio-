# ─────────────────────────────────────────────────────────────────────────────
# DOCKERFILE MULTI-STAGE — FitWell API
#
# Multi-stage significa que usamos dos "etapas" de construcción:
#   1. deps   → instala TODAS las dependencias (incluyendo devDependencies)
#   2. runner → imagen final con SOLO lo necesario para producción
#
# Resultado: imagen pequeña (<150MB) sin herramientas de desarrollo
# ─────────────────────────────────────────────────────────────────────────────

# ── STAGE 1: Instalar dependencias ───────────────────────────────────────────
FROM node:20-alpine AS deps

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos de dependencias primero
# (Docker cachea esta capa — si package.json no cambia, no reinstala)
COPY package.json ./

# Instalar solo dependencias de producción
RUN npm install --omit=dev --ignore-scripts

# ── STAGE 2: Imagen final de producción ──────────────────────────────────────
FROM node:20-alpine AS runner

# Metadatos de la imagen
LABEL maintainer="David" \
      description="FitWell API — Cloud Native" \
      version="4.0.0"

WORKDIR /app

# Copiar dependencias instaladas desde el stage anterior
COPY --from=deps /app/node_modules ./node_modules

# Copiar el código fuente
COPY src/ ./src/
COPY migrations/ ./migrations/
COPY package.json ./

# 12-Factor: configuración por variables de entorno
# Estas son las variables con sus valores por defecto
ENV NODE_ENV=production \
    PORT=3000 \
    USE_POSTGRES=true

# Exponer el puerto (documentación — no abre el puerto, eso lo hace docker-compose)
EXPOSE 3000

# Usar usuario "node" en vez de root (seguridad)
# node:20-alpine ya incluye el usuario "node" con uid 1000
USER node

# Healthcheck: Docker verifica cada 30s que la API responde
# Si falla 3 veces seguidas, el contenedor se marca como "unhealthy"
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Comando de inicio
CMD ["node", "src/server.js"]
