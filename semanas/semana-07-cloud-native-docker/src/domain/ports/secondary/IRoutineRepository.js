export class IRoutineRepository {
  async save(routine)                              { throw new Error('No implementado'); }
  async findById(id)                               { throw new Error('No implementado'); }
  async findAll()                                  { throw new Error('No implementado'); }
  async findByUserId(userId)                       { throw new Error('No implementado'); }
  async update(id, data)                           { throw new Error('No implementado'); }
  async delete(id)                                 { throw new Error('No implementado'); }
  async deactivateAllForUser(userId, exceptId)     { throw new Error('No implementado'); }
}
