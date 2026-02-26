# 🚀 Guía de Inicio Rápido

## Paso 1: Instalar Dependencias

Abre tu terminal en la carpeta `semanas/semana_4` y ejecuta:

```bash
npm install
```

**¿Qué hace esto?**
- Lee el archivo `package.json`
- Descarga Express y otras dependencias desde internet
- Las guarda en una carpeta `node_modules/`

**Salida esperada:**
```
added 57 packages, and audited 58 packages in 3s
```

## Paso 2: Iniciar el Servidor

```bash
npm start
```

**¿Qué hace esto?**
- Ejecuta el comando definido en `package.json`: `node src/server.js`
- Node.js lee y ejecuta `server.js`
- El servidor se queda corriendo (NO termina)

**Salida esperada:**
```
=================================
🚀 Servidor iniciado exitosamente
📍 URL: http://localhost:3000
📚 Endpoints disponibles:
   - GET    http://localhost:3000/api/authors
   - POST   http://localhost:3000/api/authors
   - GET    http://localhost:3000/api/books
   - POST   http://localhost:3000/api/books
=================================
```

**IMPORTANTE:** La terminal se quedará "bloqueada" mostrando esto. Es normal. El servidor está corriendo.

## Paso 3: Probar la API

### Opción A: Desde el Navegador (solo GET)

Abre tu navegador y visita:
- http://localhost:3000
- http://localhost:3000/health
- http://localhost:3000/api/authors
- http://localhost:3000/api/books

### Opción B: Con curl (desde otra terminal)

Abre **OTRA terminal** (la primera sigue con el servidor corriendo) y ejecuta:

```powershell
# Verificar que el servidor funciona
curl http://localhost:3000/health

# Crear un autor
curl -X POST http://localhost:3000/api/authors `
  -H "Content-Type: application/json" `
  -d '{\"name\": \"Gabriel García Márquez\", \"nationality\": \"Colombiano\", \"birthYear\": 1927}'

# Listar autores
curl http://localhost:3000/api/authors

# Crear un libro
curl -X POST http://localhost:3000/api/books `
  -H "Content-Type: application/json" `
  -d '{\"title\": \"Cien años de soledad\", \"authorId\": 1, \"isbn\": \"978-0307474728\", \"price\": 25.99, \"stock\": 10}'

# Listar libros
curl http://localhost:3000/api/books
```

### Opción C: Con Postman (Recomendado)

1. Descarga Postman: https://www.postman.com/downloads/
2. Crea una nueva petición
3. Selecciona el método (GET, POST, etc.)
4. Ingresa la URL: http://localhost:3000/api/authors
5. Para POST: En "Body" → "raw" → "JSON", pega:
```json
{
  "name": "Gabriel García Márquez",
  "nationality": "Colombiano",
  "birthYear": 1927
}
```
6. Click en "Send"

## Paso 4: Detener el Servidor

En la terminal donde está corriendo el servidor, presiona:
```
Ctrl + C
```

El servidor se detendrá y podrás volver a usar la terminal.

## 🔧 Comandos Útiles

### Iniciar en modo desarrollo (auto-reinicio)
```bash
npm run dev
```
Esto reinicia el servidor automáticamente cuando modificas archivos.

### Ver logs del servidor
Los logs aparecen en la terminal donde ejecutaste `npm start`:
```
GET /api/books
POST /api/authors
```

## ❓ Problemas Comunes

### Error: "Cannot find module 'express'"
**Solución:** Ejecuta `npm install` primero

### Error: "Port 3000 is already in use"
**Solución:** Ya tienes un servidor corriendo en ese puerto. Detenlo con Ctrl+C o cambia el puerto en `server.js`

### Error: "npm: command not found"
**Solución:** Node.js no está instalado correctamente. Verifica con `node --version`

### No pasa nada al hacer peticiones
**Solución:** Verifica que el servidor esté corriendo (debe mostrar el mensaje de inicio)

## 📝 Flujo de Trabajo Típico

1. **Iniciar servidor:** `npm start`
2. **Probar endpoints:** Usar navegador/Postman/curl
3. **Ver logs:** Observar la terminal del servidor
4. **Modificar código:** Editar archivos
5. **Reiniciar servidor:** Ctrl+C y `npm start` de nuevo (o usar `npm run dev`)
6. **Probar cambios:** Repetir peticiones

## 🎯 Próximos Pasos

Una vez que tengas el servidor funcionando:

1. Lee `ARQUITECTURA-EXPLICADA.md` para entender cómo funciona
2. Revisa `EJEMPLOS-PETICIONES.md` para más ejemplos
3. Experimenta creando autores y libros
4. Intenta modificar el código para agregar nuevas funcionalidades
5. Documenta tu API con Swagger (próximo paso)
