import type { PageLoaderContext } from '@melchor629/nice-ssr'
import updateApiResource, { type UpdateApiResource } from '#queries/api-resource/update-api-resource.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type EditApiResourceData = Readonly<{
  key: string
} & UpdateApiResource>

async function editApiResourceAction(context: PageLoaderContext, { key, ...data }: EditApiResourceData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const apiResource = await updateApiResource(key, data)
  // revalidatePath(`/admin/applications/${appId}`)
  return ok(apiResource)
}

export default editApiResourceAction
