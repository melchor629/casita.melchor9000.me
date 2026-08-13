import nasAuthDatabase from '@melchor629/orm-nas-auth'
import { application } from '@melchor629/orm-nas-auth/schema'
import applicationMapper from './mapper.ts'

export type CreateApplicationInput = typeof applicationMapper.$dto.$insert

const createApplication = async (values: CreateApplicationInput) => {
  const [newApplication] = await nasAuthDatabase
    .insert(application)
    .values(applicationMapper.fromDtoToInsert(values))
    .returning(applicationMapper.select)

  return applicationMapper.toDto(newApplication)
}

export default createApplication
