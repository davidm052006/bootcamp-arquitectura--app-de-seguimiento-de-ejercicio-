/**
 * Entidad User - Representa un usuario de FitWell
 * 
 * PRINCIPIO SOLID APLICADO: SRP (Single Responsibility Principle)
 * 
 * Responsabilidad ÚNICA: Representar un usuario con sus datos y lógica de negocio básica.
 * 
 * ❌ NO hace:
 * - Validar sus propios datos (eso lo hace UserValidator)
 * - Guardarse en base de datos (eso lo hace Repository)
 * - Autenticar (eso lo hace AuthService)
 * 
 * ✅ SÍ hace:
 * - Calcular IMC
 * - Actualizar peso/altura
 * - Gestionar equipamiento
 * - Lógica de negocio relacionada con el usuario
 */

export class User {
  constructor({
    id,
    email,
    password, // Ya debe venir hasheado
    nombre,
    peso,      // en kg
    altura,    // en cm
    edad,
    morfologia, // 'ectomorfo', 'mesomorfo', 'endomorfo'
    objetivo,   // 'perder_peso', 'ganar_musculo', 'mantenimiento'
    equipamiento = [] // Array de Equipment
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.nombre = nombre;
    this.peso = peso;
    this.altura = altura;
    this.edad = edad;
    this.morfologia = morfologia;
    this.objetivo = objetivo;
    this.equipamiento = equipamiento;
    this.fechaCreacion = new Date();
    this.ultimaActualizacion = new Date();
  }

  /**
   * Calcula el IMC (Índice de Masa Corporal)
   * Fórmula: peso (kg) / (altura (m))^2
   * 
   * @returns {number} IMC calculado
   */
  calcularIMC() {
    const alturaEnMetros = this.altura / 100;
    const imc = this.peso / (alturaEnMetros * alturaEnMetros);
    return parseFloat(imc.toFixed(2));
  }

  /**
   * Obtiene la categoría del IMC según estándares OMS
   * 
   * @returns {string} Categoría del IMC
   */
  obtenerCategoriaIMC() {
    const imc = this.calcularIMC();
    
    if (imc < 18.5) return 'Bajo peso';
    if (imc >= 18.5 && imc < 25) return 'Peso normal';
    if (imc >= 25 && imc < 30) return 'Sobrepeso';
    if (imc >= 30) return 'Obesidad';
    
    return 'No determinado';
  }

  /**
   * Actualiza el peso del usuario
   * 
   * @param {number} nuevoPeso - Nuevo peso en kg
   */
  actualizarPeso(nuevoPeso) {
    this.peso = nuevoPeso;
    this.ultimaActualizacion = new Date();
  }

  /**
   * Actualiza la altura del usuario
   * 
   * @param {number} nuevaAltura - Nueva altura en cm
   */
  actualizarAltura(nuevaAltura) {
    this.altura = nuevaAltura;
    this.ultimaActualizacion = new Date();
  }

  /**
   * Agrega un equipo al usuario
   * 
   * @param {Equipment} equipo - Equipo a agregar
   */
  agregarEquipamiento(equipo) {
    // Verificar que no exista ya
    const existe = this.equipamiento.some(e => e.id === equipo.id);
    if (!existe) {
      this.equipamiento.push(equipo);
      this.ultimaActualizacion = new Date();
    }
  }

  /**
   * Elimina un equipo del usuario
   * 
   * @param {string} equipoId - ID del equipo a eliminar
   */
  eliminarEquipamiento(equipoId) {
    this.equipamiento = this.equipamiento.filter(e => e.id !== equipoId);
    this.ultimaActualizacion = new Date();
  }

  /**
   * Obtiene los IDs de equipamiento disponible
   * 
   * @returns {Array<string>} Array de IDs de equipamiento
   */
  obtenerEquipamientoIds() {
    return this.equipamiento.map(e => e.id);
  }

  /**
   * Verifica si el usuario tiene un equipo específico
   * 
   * @param {string} equipoId - ID del equipo a verificar
   * @returns {boolean} true si tiene el equipo
   */
  tieneEquipamiento(equipoId) {
    return this.equipamiento.some(e => e.id === equipoId);
  }

  /**
   * Convierte el usuario a un objeto simple (sin métodos)
   * Útil para serializar a JSON
   * 
   * @returns {Object} Representación simple del usuario
   */
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      nombre: this.nombre,
      peso: this.peso,
      altura: this.altura,
      edad: this.edad,
      morfologia: this.morfologia,
      objetivo: this.objetivo,
      imc: this.calcularIMC(),
      categoriaIMC: this.obtenerCategoriaIMC(),
      equipamiento: this.equipamiento,
      fechaCreacion: this.fechaCreacion,
      ultimaActualizacion: this.ultimaActualizacion
    };
  }
}
