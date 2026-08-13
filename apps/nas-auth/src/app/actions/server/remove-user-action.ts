'use server'

import { redirect, type PageLoaderContext } from '@melchor629/nice-ssr'
import { deleteUser } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

async function removeUserAction(context: PageLoaderContext, userName: string) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const deleted = await deleteUser({ userName })
  // revalidatePath('/admin/users')
  // revalidatePath(`/admin/users/${id}`)
  if (deleted) {
    redirect('/admin/users')
  }

  return ok(false)
}

export default removeUserAction
