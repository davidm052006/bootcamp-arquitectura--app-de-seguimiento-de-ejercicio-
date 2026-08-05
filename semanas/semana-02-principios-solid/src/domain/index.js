// index.js
// Punto de entrada del proyecto - Demo de SOLID en acción
// Aquí se conecta todo: Repository → Service → Demo

import { MemoryEquipmentRepository } from './repositories/MemoryEquipmentRepository.js';
import { EquipmentService } from './services/EquipmentService.js';

console.log("=".repeat(60));
console.log("🏋️  FitWell - Semana 2: Principios SOLID");
console.log("=".repeat(60));
console.log();

// ========== INYECCIÓN DE DEPENDENCIAS (DIP) ==========
console.log("📦 Creando instancias...");
const equipmentRepository = new MemoryEquipmentRepository();
const equipmentService = new EquipmentService(equipmentRepository);
console.log("✅ Repository y Service creados");
console.log();

// ========== AGREGAR EQUIPOS ==========
console.log("➕ Agregando equipos...");
const mancuernas = equipmentService.addEquipment("Mancuernas", "PESO_LIBRE");
console.log(`✅ Agregado: ${mancuernas.toString()}`);

const colchoneta = equipmentService.addEquipment("Colchoneta", "ACCESORIO");
console.log(`✅ Agregado: ${colchoneta.toString()}`);

const cuerda = equipmentService.addEquipment("Cuerda para Saltar", "CARDIO");
console.log(`✅ Agregado: ${cuerda.toString()}`);

const barra = equipmentService.addEquipment("Barra de Dominadas", "PESO_CORPORAL");
console.log(`✅ Agregado: ${barra.toString()}`);
console.log();

// ========== LISTAR TODOS LOS EQUIPOS ==========
console.log("📋 Listando todos los equipos:");
const todosLosEquipos = equipmentService.listEquipment();
todosLosEquipos.forEach((equipo, index) => {
  console.log(`  ${index + 1}. ${equipo.getNombre()} (${equipo.getTipo()}) - ${equipo.isDisponible() ? '✅ Disponible' : '❌ No disponible'}`);
});
console.log(`Total: ${todosLosEquipos.length} equipos`);
console.log();

// ========== BUSCAR EQUIPO POR ID ==========
console.log("🔍 Buscando equipo por ID...");
const equipoEncontrado = equipmentService.getEquipmentById(mancuernas.getId());
if (equipoEncontrado) {
  console.log(`✅ Encontrado: ${equipoEncontrado.toString()}`);
} else {
  console.log("❌ No encontrado");
}
console.log();

// ========== MARCAR EQUIPO COMO NO DISPONIBLE ==========
console.log("🔧 Marcando 'Cuerda para Saltar' como no disponible...");
cuerda.marcarComoNoDisponible();
console.log(`✅ Estado actualizado: ${cuerda.toString()}`);
console.log();

// ========== LISTAR SOLO EQUIPOS DISPONIBLES ==========
console.log("📋 Listando solo equipos disponibles:");
const equiposDisponibles = equipmentService.listAvailableEquipment();
equiposDisponibles.forEach((equipo, index) => {
  console.log(`  ${index + 1}. ${equipo.getNombre()} (${equipo.getTipo()})`);
});
console.log(`Total disponibles: ${equiposDisponibles.length} de ${todosLosEquipos.length}`);
console.log();

// ========== ELIMINAR EQUIPO ==========
console.log("🗑️  Eliminando 'Barra de Dominadas'...");
const eliminado = equipmentService.removeEquipment(barra.getId());
if (eliminado) {
  console.log("✅ Equipo eliminado correctamente");
} else {
  console.log("❌ No se pudo eliminar (no existe)");
}
console.log();

// ========== LISTAR EQUIPOS DESPUÉS DE ELIMINAR ==========
console.log("📋 Listando equipos después de eliminar:");
const equiposDespues = equipmentService.listEquipment();
equiposDespues.forEach((equipo, index) => {
  console.log(`  ${index + 1}. ${equipo.getNombre()} (${equipo.getTipo()})`);
});
console.log(`Total: ${equiposDespues.length} equipos`);
console.log();

// ========== RESUMEN DE PRINCIPIOS SOLID APLICADOS ==========
console.log("=".repeat(60));
console.log("✅ Principios SOLID Aplicados:");
console.log("=".repeat(60));
console.log("1. SRP: Equipment solo tiene datos, Repository solo persistencia, Service solo lógica");
console.log("2. OCP: Repository es extensible (podemos agregar PostgresRepository sin modificar código)");
console.log("3. LSP: Cualquier Repository puede sustituir a otro");
console.log("4. ISP: Repository tiene solo métodos esenciales");
console.log("5. DIP: EquipmentService depende de Repository (abstracción), no de MemoryRepository");
console.log("=".repeat(60));
