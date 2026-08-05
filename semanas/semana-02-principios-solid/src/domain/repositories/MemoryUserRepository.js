// MemoryUserRepository.js
// Implementación del patrón Repository para User
// (Pendiente de implementar en futuras semanas)

import { Repository } from '../interfaces/Repository.js';

export class MemoryUserRepository extends Repository {
  #users = new Map();
  
  save(user) {
    throw new Error("Implementar en semana 3");
  }
  
  findById(id) {
    throw new Error("Implementar en semana 3");
  }
  
  findAll() {
    throw new Error("Implementar en semana 3");
  }
  
  delete(id) {
    throw new Error("Implementar en semana 3");
  }
}
