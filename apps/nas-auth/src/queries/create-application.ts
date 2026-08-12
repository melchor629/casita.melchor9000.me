import nasAuthDatabase from '@melchor629/orm-nas-auth'
import { application } from '@melchor629/orm-nas-auth/schema'

export type CreateApplicationInput = {
  key: string
  name: string
}

const createApplication = async (values: CreateApplicationInput) => {
  const [newApplication] = await nasAuthDatabase
    .insert(application)
    .values({
      key: values.key,
      name: values.name,
    })
    .returning()

  return newApplication
}

export default createApplication
