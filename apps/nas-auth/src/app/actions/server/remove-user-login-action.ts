'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { deleteLogin } from '#queries/index.ts'
import type { CreateLoginInput } from '#queries/login/create-login.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type RemoveUserLoginData = Readonly<{
  loginId: string
  type: CreateLoginInput['type']
}>

async function removeUserLoginAction(context: PageLoaderContext, { loginId, type }: RemoveUserLoginData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const login = await deleteLogin(type, loginId)
  // revalidatePath(`/admin/users/${userId}`)
  return ok(login)
}

export default removeUserLoginAction
