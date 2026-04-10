export class IUserRepository {
  async save(user)         { throw new Error('No implementado'); }
  async findById(id)       { throw new Error('No implementado'); }
  async findAll()          { throw new Error('No implementado'); }
  async findByEmail(email) { throw new Error('No implementado'); }
  async update(id, data)   { throw new Error('No implementado'); }
  async delete(id)         { throw new Error('No implementado'); }
}
