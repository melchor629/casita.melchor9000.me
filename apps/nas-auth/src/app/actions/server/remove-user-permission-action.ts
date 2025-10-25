'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { deleteUserPermission } from '../../queries'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type RemoveUserPermissionData = Readonly<{
  id: number
  userId: number
}>

async function removeUserPermissionAction(context: PageLoaderContext, { id }: RemoveUserPermissionData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const deleted = await deleteUserPermission(id)
  // revalidatePath(`/admin/users/${userId}`)
  return ok(deleted)
}

export default removeUserPermissionAction
