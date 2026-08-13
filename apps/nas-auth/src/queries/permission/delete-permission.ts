import nasAuthDatabase, { and, eq, sql } from '@melchor629/orm-nas-auth'
import { application, permission } from '@melchor629/orm-nas-auth/schema'

const deletePermission = async (appKey: string, name: string) => {
  const appQuery = nasAuthDatabase.$with('app').as(
    nasAuthDatabase
      .select({ id: application.id })
      .from(application)
      .where(eq(application.key, appKey)),
  )

  const result = await nasAuthDatabase
    .with(appQuery)
    .delete(permission)
    .where(and(
      eq(permission.name, name),
      eq(permission.applicationId, sql`(select "id" from ${appQuery})`),
    ))

  return (result.rowCount ?? 0) > 0
}

export default deletePermission
