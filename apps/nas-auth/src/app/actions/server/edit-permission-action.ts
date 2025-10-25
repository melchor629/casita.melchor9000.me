'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updatePermission } from '../../queries'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type EditPermissionData = Readonly<{
  id: number
  appId: string
  name?: string
  displayName?: string | null
}>

async function editPermissionAction(context: PageLoaderContext, { id, ...data }: EditPermissionData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const perm = await updatePermission(id, data)
  // revalidatePath(`/admin/applications/${appId}`)
  return ok(perm)
}

export default editPermissionAction
