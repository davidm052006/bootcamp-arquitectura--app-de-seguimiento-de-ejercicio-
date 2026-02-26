/**
 * Entidad: Libro
 * Representa un libro en la librería
 */
export class Book {
  constructor(id, title, authorId, isbn, price, stock) {
    this.id = id;
    this.title = title;
    this.authorId = authorId;
    this.isbn = isbn;
    this.price = price;
    this.stock = stock;
    this.createdAt = new Date();
  }

  /**
   * Verifica si el libro está disponible en stock
   */
  isAvailable() {
    return this.stock > 0;
  }

  /**
   * Reduce el stock cuando se vende un libro
   */
  sell(quantity = 1) {
    if (quantity > this.stock) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= quantity;
  }

  /**
   * Aumenta el stock cuando llegan nuevos libros
   */
  restock(quantity) {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser positiva');
    }
    this.stock += quantity;
  }
}
