import { DataSource } from 'typeorm'
import baseOptions from '../config.js'
import * as entities from './entities/index.js'
import * as migrations from './migrations/index.js'

const nasAuthDataSource = new DataSource({
  ...baseOptions,
  schema: 'auth',
  entities: Object.values(entities),
  migrations: Object.values(migrations),
})

export default nasAuthDataSource
