'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { deleteUserPermission } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type RemoveUserPermissionData = Readonly<{
  userName: string
  permissionName: string
  applicationKey: string
}>

async function removeUserPermissionAction(context: PageLoaderContext, { applicationKey, permissionName, userName }: RemoveUserPermissionData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const deleted = await deleteUserPermission(permissionName, applicationKey, userName)
  // revalidatePath(`/admin/users/${userId}`)
  return ok(deleted)
}

export default removeUserPermissionAction
