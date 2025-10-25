'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { createUser } from '../../queries'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type AddUserData = Readonly<{
  userName: string
  displayName: string
  disabled: boolean
}>

async function addUserAction(context: PageLoaderContext, data: AddUserData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const user = await createUser(data)
  // revalidatePath('/admin/users')
  return ok(user)
}

export default addUserAction
