'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updateApplication } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type EditApplicationData = Readonly<{
  key: string
  name: string
}>

async function editApplicationAction(context: PageLoaderContext, { key, ...data }: EditApplicationData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const login = await updateApplication(key, data)
  // revalidatePath(`/admin/applications/${key}`)
  return ok(login)
}

export default editApplicationAction
