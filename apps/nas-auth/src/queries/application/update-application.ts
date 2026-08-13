import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { application } from '@melchor629/orm-nas-auth/schema'

type UpdateApplicationInput = {
  name?: string
}

const updateApplication = async (key: string, data: UpdateApplicationInput) => {
  const updatedApplication = nasAuthDatabase
    .update(application)
    .set({
      name: data.name,
    })
    .where(eq(application.key, key))
    .returning()

  return updatedApplication
}

export default updateApplication
