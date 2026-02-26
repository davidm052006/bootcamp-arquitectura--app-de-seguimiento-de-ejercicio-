/**
 * Entidad: Autor
 * Representa un autor de libros
 */
export class Author {
  constructor(id, name, nationality, birthYear) {
    this.id = id;
    this.name = name;
    this.nationality = nationality;
    this.birthYear = birthYear;
    this.createdAt = new Date();
  }

  /**
   * Calcula la edad aproximada del autor
   */
  getAge() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.birthYear;
  }

  /**
   * Verifica si el autor es contemporáneo (vivo)
   */
  isContemporary() {
    return this.getAge() < 120; // Asumimos que autores mayores a 120 años ya fallecieron
  }
}
