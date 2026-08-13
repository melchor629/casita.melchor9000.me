'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updatePermission } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type EditPermissionData = Readonly<{
  appKey: string
  name: string
  displayName?: string
}>

async function editPermissionAction(context: PageLoaderContext, { appKey, name, ...data }: EditPermissionData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const perm = await updatePermission(appKey, name, data)
  // revalidatePath(`/admin/applications/${appId}`)
  return ok(perm)
}

export default editPermissionAction
