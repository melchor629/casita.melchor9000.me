import type { DataSource } from 'typeorm'
import BaseRepository from '../../base-repository.js'
import UserPermission from '../entities/user-permission.js'

export default class UserPermissionRepository extends BaseRepository<UserPermission> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(UserPermission))
  }
}
