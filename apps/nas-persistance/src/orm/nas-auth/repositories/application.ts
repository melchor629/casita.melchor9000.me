import type { DataSource } from 'typeorm'
import BaseRepository from '../../base-repository.js'
import Application from '../entities/application.js'

export default class ApplicationRepository extends BaseRepository<Application> {
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(Application))
  }
}
