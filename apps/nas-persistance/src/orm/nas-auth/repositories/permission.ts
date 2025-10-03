import type { DataSource } from 'typeorm'
import BaseRepository from '../../base-repository.js'
import Permission from '../entities/permission.js'

export default class PermissionRepository extends BaseRepository<Permission> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(Permission))
  }
}
