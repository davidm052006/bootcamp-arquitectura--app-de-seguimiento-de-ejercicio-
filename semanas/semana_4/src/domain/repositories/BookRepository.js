/**
 * Repositorio de Libros
 * Maneja el almacenamiento en memoria de libros
 */
export class BookRepository {
  constructor() {
    this.books = new Map();
    this.nextId = 1;
  }

  /**
   * Crea un nuevo libro
   */
  create(book) {
    const id = this.nextId++;
    book.id = id;
    this.books.set(id, book);
    return book;
  }

  /**
   * Obtiene todos los libros
   */
  findAll() {
    return Array.from(this.books.values());
  }

  /**
   * Busca un libro por ID
   */
  findById(id) {
    return this.books.get(id) || null;
  }

  /**
   * Actualiza un libro existente
   */
  update(id, updatedData) {
    const book = this.books.get(id);
    if (!book) return null;

    Object.assign(book, updatedData);
    return book;
  }

  /**
   * Elimina un libro
   */
  delete(id) {
    return this.books.delete(id);
  }

  /**
   * Busca libros por autor
   */
  findByAuthor(authorId) {
    return this.findAll().filter(b => b.authorId === authorId);
  }

  /**
   * Busca libros disponibles (con stock)
   */
  findAvailable() {
    return this.findAll().filter(b => b.isAvailable());
  }
}
