/**
 * Repositorio de Autores
 * Maneja el almacenamiento en memoria de autores
 */
export class AuthorRepository {
  constructor() {
    this.authors = new Map();
    this.nextId = 1;
  }

  /**
   * Crea un nuevo autor
   */
  create(author) {
    const id = this.nextId++;
    author.id = id;
    this.authors.set(id, author);
    return author;
  }

  /**
   * Obtiene todos los autores
   */
  findAll() {
    return Array.from(this.authors.values());
  }

  /**
   * Busca un autor por ID
   */
  findById(id) {
    return this.authors.get(id) || null;
  }

  /**
   * Actualiza un autor existente
   */
  update(id, updatedData) {
    const author = this.authors.get(id);
    if (!author) return null;

    Object.assign(author, updatedData);
    return author;
  }

  /**
   * Elimina un autor
   */
  delete(id) {
    return this.authors.delete(id);
  }

  /**
   * Busca autores por nacionalidad
   */
  findByNationality(nationality) {
    return this.findAll().filter(a => a.nationality === nationality);
  }
}
