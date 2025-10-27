'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { deletePermission } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type RemovePermissionData = Readonly<{
  id: number
  appId: string
}>

async function removePermissionAction(context: PageLoaderContext, { id }: RemovePermissionData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const deleted = await deletePermission(id)
  if (deleted) {
    // revalidatePath(`/admin/applications/${appId}`)
  }
  return ok(deleted)
}

export default removePermissionAction
