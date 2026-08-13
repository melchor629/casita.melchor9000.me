import nasAuthDatabase, { eq } from '@melchor629/orm-nas-auth'
import { application } from '@melchor629/orm-nas-auth/schema'

const deleteApplication = async (key: string) => {
  const result = await nasAuthDatabase
    .delete(application)
    .where(eq(application.key, key))

  return (result.rowCount ?? 0) > 0
}

export default deleteApplication
