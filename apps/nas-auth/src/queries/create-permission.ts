import nasAuthDatabase, { eq, sql } from '@melchor629/orm-nas-auth'
import { application, permission } from '@melchor629/orm-nas-auth/schema'

type CreatePermissionInput = {
  applicationKey: string
  displayName?: string | null
  name: string
}

const createPermission = async ({ applicationKey, ...values }: CreatePermissionInput) => {
  const appKeyQuery = nasAuthDatabase.$with('app_key').as(
    nasAuthDatabase
      .select({ id: application.id })
      .from(application)
      .where(eq(application.key, applicationKey)),
  )

  const [newPermission] = await nasAuthDatabase
    .with(appKeyQuery)
    .insert(permission)
    .values({
      ...values,
      applicationId: sql`(select id from ${appKeyQuery})`,
    })
    .returning()

  return { ...newPermission, applicationKey }
}

export default createPermission
