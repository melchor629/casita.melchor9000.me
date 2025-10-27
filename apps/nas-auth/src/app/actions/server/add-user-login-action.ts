'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { createLogin } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddUserLoginData = Readonly<{
  data?: string | null
  disabled: boolean
  loginId: string
  type: string
  userId: number
}>

async function addUserLoginAction(context: PageLoaderContext, data: AddUserLoginData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const login = await createLogin({
    ...data,
    data: JSON.stringify(data.data ?? null),
  })
  // revalidatePath(`/admin/users/${data.userId}`)
  return ok(login)
}

export default addUserLoginAction
