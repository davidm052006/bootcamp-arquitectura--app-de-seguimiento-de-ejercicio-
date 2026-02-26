import { Author } from '../entities/Author.js';

/**
 * Servicio de Autores
 * Contiene la lógica de negocio para gestionar autores
 */
export class AuthorService {
  constructor(authorRepository) {
    this.authorRepository = authorRepository;
  }

  /**
   * Crea un nuevo autor
   */
  createAuthor(authorData) {
    // Validaciones
    if (!authorData.name || authorData.name.trim() === '') {
      throw new Error('El nombre es obligatorio');
    }

    if (authorData.birthYear > new Date().getFullYear()) {
      throw new Error('El año de nacimiento no puede ser futuro');
    }

    const author = new Author(
      null,
      authorData.name,
      authorData.nationality,
      authorData.birthYear
    );

    return this.authorRepository.create(author);
  }

  /**
   * Obtiene todos los autores
   */
  getAllAuthors() {
    return this.authorRepository.findAll();
  }

  /**
   * Obtiene un autor por ID
   */
  getAuthorById(id) {
    const author = this.authorRepository.findById(id);
    if (!author) {
      throw new Error('Autor no encontrado');
    }
    return author;
  }

  /**
   * Actualiza un autor
   */
  updateAuthor(id, updateData) {
    const author = this.authorRepository.findById(id);
    if (!author) {
      throw new Error('Autor no encontrado');
    }

    return this.authorRepository.update(id, updateData);
  }

  /**
   * Elimina un autor
   */
  deleteAuthor(id) {
    const author = this.authorRepository.findById(id);
    if (!author) {
      throw new Error('Autor no encontrado');
    }

    return this.authorRepository.delete(id);
  }

  /**
   * Obtiene autores por nacionalidad
   */
  getAuthorsByNationality(nationality) {
    return this.authorRepository.findByNationality(nationality);
  }
}
