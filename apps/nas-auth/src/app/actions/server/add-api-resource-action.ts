'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { createApiResource } from '../../queries'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddApiResourceData = Readonly<{
  appId: string
  audience: string
  key: string
  name: string
}>

async function addApiResourceAction(context: PageLoaderContext, { appId, ...data }: AddApiResourceData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const apiResource = await createApiResource({
    ...data,
    applicationKey: appId,
    accessTokenFormat: 'jwt',
    scopes: [],
  })
  // revalidatePath(`/admin/applications/${appId}`)
  return ok(apiResource)
}

export default addApiResourceAction
