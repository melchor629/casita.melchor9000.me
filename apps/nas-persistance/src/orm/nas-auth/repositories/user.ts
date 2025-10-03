import type { DataSource } from 'typeorm'
import BaseRepository from '../../base-repository.js'
import User from '../entities/user.js'

export default class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(User))
  }
}
