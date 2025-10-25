'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { createUserPermission } from '../../queries'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddUserPermissionData = Readonly<{
  userId: number
  permissionId: number
  write: boolean
  delete: boolean
}>

async function addUserPermissionAction(context: PageLoaderContext, data: AddUserPermissionData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const userPermission = await createUserPermission(data)
  // revalidatePath(`/admin/users/${data.userId}`)
  return ok(userPermission)
}

export default addUserPermissionAction
