'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updateApiResource } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type EditApiResourceData = Readonly<{
  appId: string
  accessTokenFormat: 'opaque' | 'jwt'
  accessTokenTTL?: number
  audience: string
  jwt?: unknown
  key: string
  name: string
  scopes: readonly string[]
}>

async function editApiResourceAction(context: PageLoaderContext, { appId, key, ...data }: EditApiResourceData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const apiResource = await updateApiResource(key, data)
  // revalidatePath(`/admin/applications/${appId}`)
  return ok(apiResource)
}

export default editApiResourceAction
