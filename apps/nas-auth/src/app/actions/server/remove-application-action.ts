'use server'

import { redirect, type PageLoaderContext } from '@melchor629/nice-ssr'
import { deleteApplication } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

async function removeApplicationAction(context: PageLoaderContext, applicationId: string) {
  const sessionResult = await ensureSession(context, 'application', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const deleted = await deleteApplication(applicationId)
  if (deleted) {
    // revalidatePath('/admin/applications')
    // revalidatePath(`/admin/applications/${applicationId}`)
    redirect('/admin/applications')
  }

  return ok(deleted)
}

export default removeApplicationAction
