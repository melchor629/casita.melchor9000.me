import nasAuthDatabase, { asc } from '@melchor629/orm-nas-auth'
import { application } from '@melchor629/orm-nas-auth/schema'
import applicationMapper from './mapper.ts'

export type GetApplications = Array<{
  key: string
  name: string
}>

const getApplications = async (): Promise<GetApplications> => {
  const results = await nasAuthDatabase
    .select(applicationMapper.select)
    .from(application)
    .orderBy(asc(application.key))

  return results
}

export default getApplications
