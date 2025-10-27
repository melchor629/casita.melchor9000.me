'use server'

import { redirect, type PageLoaderContext } from '@melchor629/nice-ssr'
import { deleteClient } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

async function removeClientAction(context: PageLoaderContext, clientId: string) {
  const sessionResult = await ensureSession(context, 'client', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const deleted = await deleteClient(clientId)
  if (deleted) {
    // revalidatePath('/admin/clients')
    // revalidatePath(`/admin/clients/${clientId}`)
    redirect('/admin/clients')
  }
  return ok(deleted)
}

export default removeClientAction
