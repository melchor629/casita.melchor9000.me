'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updateLogin } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type EditUserLoginData = Readonly<{
  data?: Record<string, unknown> | null
  disabled: boolean
  loginId: number
}>

async function editUserLoginAction(context: PageLoaderContext, { loginId, ...data }: EditUserLoginData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const login = await updateLogin(loginId, {
    ...data,
    data: data.data ?? undefined,
  })
  // revalidatePath(`/admin/users/${userId}`)
  return ok(login)
}

export default editUserLoginAction
