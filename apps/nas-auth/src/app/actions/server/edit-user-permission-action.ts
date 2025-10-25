'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updateUserPermission } from '../../queries'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddUserPermissionData = Readonly<{
  userId: number
  id: number
  permissionId: string
  write: boolean
  delete: boolean
}>

async function editUserPermissionAction(context: PageLoaderContext, { id, userId, ...data }: AddUserPermissionData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const userPermission = await updateUserPermission(id, data)
  // revalidatePath(`/admin/users/${userId}`)
  return ok(userPermission)
}

export default editUserPermissionAction
