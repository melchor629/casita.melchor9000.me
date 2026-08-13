'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updateUserPermission } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddUserPermissionData = Readonly<{
  userName: string
  permissionName: string
  applicationKey: string
  write: boolean
  delete: boolean
}>

async function editUserPermissionAction(context: PageLoaderContext, { applicationKey, permissionName, userName, ...data }: AddUserPermissionData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const userPermission = await updateUserPermission(applicationKey, permissionName, userName, data)
  // revalidatePath(`/admin/users/${userId}`)
  return ok(userPermission)
}

export default editUserPermissionAction
