'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { createPermission } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddPermissionData = Readonly<{
  appId: string
  name: string
  displayName?: string | null
}>

async function addPermissionAction(context: PageLoaderContext, { appId, ...data }: AddPermissionData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const perm = await createPermission({
    ...data,
    applicationKey: appId,
  })
  // revalidatePath(`/admin/applications/${appId}`)
  return ok(perm)
}

export default addPermissionAction
