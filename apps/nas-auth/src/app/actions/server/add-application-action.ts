'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { createApplication } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddApplicationData = Readonly<{
  key: string
  name: string
}>

async function addApplicationAction(context: PageLoaderContext, data: AddApplicationData) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const application = await createApplication(data)
  // revalidatePath('/admin/applications')
  return ok(application)
}

export default addApplicationAction
