'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { deleteLogin } from '../../queries'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type RemoveUserLoginData = Readonly<{
  loginId: number
  userId: number
}>

async function removeUserLoginAction(context: PageLoaderContext, { loginId }: RemoveUserLoginData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const login = await deleteLogin(loginId)
  // revalidatePath(`/admin/users/${userId}`)
  return ok(login)
}

export default removeUserLoginAction
