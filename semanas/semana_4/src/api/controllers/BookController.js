/**
 * Controlador de Libros
 * Maneja las peticiones HTTP relacionadas con libros
 * 
 * RESPONSABILIDAD: Traducir HTTP a lógica de negocio
 * - Recibe peticiones HTTP (req)
 * - Extrae datos del request
 * - Llama al servicio correspondiente
 * - Devuelve respuestas HTTP (res) con códigos de estado apropiados
 */
export class BookController {
  constructor(bookService) {
    this.bookService = bookService;
  }

  /**
   * GET /api/books
   * Obtiene todos los libros
   */
  async getAll(req, res) {
    try {
      const books = this.bookService.getAllBooks();
      res.status(200).json({
        success: true,
        data: books,
        count: books.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/books/:id
   * Obtiene un libro por ID
   */
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const book = this.bookService.getBookById(id);
      
      res.status(200).json({
        success: true,
        data: book
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/books
   * Crea un nuevo libro
   */
  async create(req, res) {
    try {
      const bookData = req.body;
      const newBook = this.bookService.createBook(bookData);
      
      res.status(201).json({
        success: true,
        data: newBook,
        message: 'Libro creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /api/books/:id
   * Actualiza un libro existente
   */
  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedBook = this.bookService.updateBook(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedBook,
        message: 'Libro actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/books/:id
   * Elimina un libro
   */
  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      this.bookService.deleteBook(id);
      
      res.status(200).json({
        success: true,
        message: 'Libro eliminado exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/books/author/:authorId
   * Obtiene libros de un autor específico
   */
  async getByAuthor(req, res) {
    try {
      const authorId = parseInt(req.params.authorId);
      const books = this.bookService.getBooksByAuthor(authorId);
      
      res.status(200).json({
        success: true,
        data: books,
        count: books.length
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}
