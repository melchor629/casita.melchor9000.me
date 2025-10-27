'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updateClient } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type EditClientData = Readonly<{
  clientId: string
  clientName: string
} & Record<string, unknown>>

async function editClientAction(context: PageLoaderContext, { clientId, ...data }: EditClientData) {
  const sessionResult = await ensureSession(context, 'client', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const client = await updateClient(clientId, data)
  // revalidatePath('/admin/clients')
  // revalidatePath(`/admin/clients/${data.clientId}`)
  return ok(client)
}

export default editClientAction
