/**
 * PATRÓN: SINGLETON
 *
 * Problema: El puerto, límites de paginación y versión de la API estaban
 * hardcodeados en múltiples archivos (server.js, controllers, etc.).
 * Si querías cambiar el límite de paginación, tenías que buscarlo en varios lugares.
 *
 * Solución: Una única instancia de configuración compartida por todo el sistema.
 * La clase garantiza que solo existe UN objeto AppConfig en toda la aplicación.
 */
export class AppConfig {
  // La instancia única se guarda aquí (propiedad estática privada)
  static #instance = null;

  // El constructor es privado conceptualmente — no se llama directamente
  constructor() {
    this.port = 3000;
    this.apiVersion = 'v1';
    this.apiPrefix = `/api/${this.apiVersion}`;
    this.pagination = {
      defaultPage: 1,
      defaultLimit: 10,
      maxLimit: 100,
    };
    this.appName = 'FitWell API';
    this.appVersion = '2.0.0'; // semana 5
  }

  /**
   * Punto de acceso global a la instancia única.
   * Si no existe, la crea. Si ya existe, devuelve la misma.
   */
  static getInstance() {
    if (!AppConfig.#instance) {
      AppConfig.#instance = new AppConfig();
    }
    return AppConfig.#instance;
  }
}
