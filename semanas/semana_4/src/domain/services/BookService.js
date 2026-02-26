import { Book } from '../entities/Book.js';

/**
 * Servicio de Libros
 * Contiene la lógica de negocio para gestionar libros
 */
export class BookService {
  constructor(bookRepository, authorRepository) {
    this.bookRepository = bookRepository;
    this.authorRepository = authorRepository;
  }

  /**
   * Crea un nuevo libro
   * Valida que el autor exista antes de crear el libro
   */
  createBook(bookData) {
    // Validar que el autor existe
    const author = this.authorRepository.findById(bookData.authorId);
    if (!author) {
      throw new Error('El autor especificado no existe');
    }

    // Validar datos básicos
    if (!bookData.title || bookData.title.trim() === '') {
      throw new Error('El título es obligatorio');
    }

    if (bookData.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (bookData.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }

    const book = new Book(
      null,
      bookData.title,
      bookData.authorId,
      bookData.isbn,
      bookData.price,
      bookData.stock
    );

    return this.bookRepository.create(book);
  }

  /**
   * Obtiene todos los libros
   */
  getAllBooks() {
    return this.bookRepository.findAll();
  }

  /**
   * Obtiene un libro por ID
   */
  getBookById(id) {
    const book = this.bookRepository.findById(id);
    if (!book) {
      throw new Error('Libro no encontrado');
    }
    return book;
  }

  /**
   * Actualiza un libro
   */
  updateBook(id, updateData) {
    const book = this.bookRepository.findById(id);
    if (!book) {
      throw new Error('Libro no encontrado');
    }

    // Si se cambia el autor, validar que existe
    if (updateData.authorId && updateData.authorId !== book.authorId) {
      const author = this.authorRepository.findById(updateData.authorId);
      if (!author) {
        throw new Error('El autor especificado no existe');
      }
    }

    return this.bookRepository.update(id, updateData);
  }

  /**
   * Elimina un libro
   */
  deleteBook(id) {
    const book = this.bookRepository.findById(id);
    if (!book) {
      throw new Error('Libro no encontrado');
    }

    return this.bookRepository.delete(id);
  }

  /**
   * Obtiene libros de un autor específico
   */
  getBooksByAuthor(authorId) {
    const author = this.authorRepository.findById(authorId);
    if (!author) {
      throw new Error('Autor no encontrado');
    }

    return this.bookRepository.findByAuthor(authorId);
  }

  /**
   * Vende un libro (reduce stock)
   */
  sellBook(id, quantity = 1) {
    const book = this.getBookById(id);
    book.sell(quantity);
    return book;
  }
}
