/**
 * Controlador de Autores
 * Maneja las peticiones HTTP relacionadas con autores
 */
export class AuthorController {
  constructor(authorService) {
    this.authorService = authorService;
  }

  /**
   * GET /api/authors
   * Obtiene todos los autores
   */
  async getAll(req, res) {
    try {
      const authors = this.authorService.getAllAuthors();
      res.status(200).json({
        success: true,
        data: authors,
        count: authors.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * GET /api/authors/:id
   * Obtiene un autor por ID
   */
  async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const author = this.authorService.getAuthorById(id);
      
      res.status(200).json({
        success: true,
        data: author
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * POST /api/authors
   * Crea un nuevo autor
   */
  async create(req, res) {
    try {
      const authorData = req.body;
      const newAuthor = this.authorService.createAuthor(authorData);
      
      res.status(201).json({
        success: true,
        data: newAuthor,
        message: 'Autor creado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * PUT /api/authors/:id
   * Actualiza un autor existente
   */
  async update(req, res) {
    try {
      const id = parseInt(req.params.id);
      const updateData = req.body;
      const updatedAuthor = this.authorService.updateAuthor(id, updateData);
      
      res.status(200).json({
        success: true,
        data: updatedAuthor,
        message: 'Autor actualizado exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * DELETE /api/authors/:id
   * Elimina un autor
   */
  async delete(req, res) {
    try {
      const id = parseInt(req.params.id);
      this.authorService.deleteAuthor(id);
      
      res.status(200).json({
        success: true,
        message: 'Autor eliminado exitosamente'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}
