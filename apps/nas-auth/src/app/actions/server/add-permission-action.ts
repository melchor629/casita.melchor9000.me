'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { createPermission } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddPermissionData = Readonly<{
  appKey: string
  name: string
  displayName: string | null
}>

async function addPermissionAction(context: PageLoaderContext, { appKey, ...data }: AddPermissionData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const perm = await createPermission({
    ...data,
    applicationKey: appKey,
  })
  // revalidatePath(`/admin/applications/${appId}`)
  return ok(perm)
}

export default addPermissionAction
