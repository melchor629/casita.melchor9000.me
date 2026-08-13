'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { deletePermission } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type RemovePermissionData = Readonly<{
  appKey: string
  name: string
}>

async function removePermissionAction(context: PageLoaderContext, { appKey, name }: RemovePermissionData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const deleted = await deletePermission(appKey, name)
  if (deleted) {
    // revalidatePath(`/admin/applications/${appId}`)
  }
  return ok(deleted)
}

export default removePermissionAction
