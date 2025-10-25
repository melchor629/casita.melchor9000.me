'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { deleteApiResource } from '../../queries'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type RemoveApiResourceData = Readonly<{
  appId: string
  key: string
}>

async function removeApiResourceAction(context: PageLoaderContext, { key }: RemoveApiResourceData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const deleted = await deleteApiResource(key)
  if (deleted) {
    // revalidatePath(`/admin/applications/${appId}`)
  }
  return ok(deleted)
}

export default removeApiResourceAction
