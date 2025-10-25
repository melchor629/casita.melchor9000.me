'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updateUser } from '../../queries'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type UpdateUserData = Readonly<{
  id: number
  userName: string
  displayName: string
  givenName: string | null | undefined
  familyName: string | null | undefined
  profileImageUrl: string | null | undefined
  email: string | null | undefined
  disabled: boolean
}>

async function editUserAction(context: PageLoaderContext, { id, ...data }: UpdateUserData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const user = await updateUser(id, data)
  // revalidatePath('/admin/users')
  // revalidatePath(`/admin/users/${id}`)
  return ok(user)
}

export default editUserAction
