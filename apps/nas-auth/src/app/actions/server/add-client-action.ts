'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { createClient } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddClientData = Readonly<{
  clientId: string
  clientName: string
} & Record<string, unknown>>

async function addClientAction(context: PageLoaderContext, data: AddClientData) {
  const sessionResult = await ensureSession(context, 'client', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const client = await createClient(data)
  // revalidatePath('/admin/clients')
  return ok(client)
}

export default addClientAction
