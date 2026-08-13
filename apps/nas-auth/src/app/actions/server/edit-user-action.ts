import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updateUser } from '#queries/index.ts'
import { ensureSession } from './get-session-action'
import { ok } from './helpers'

type UpdateUserData = Readonly<{
  userName: string
  displayName: string
  givenName: string | undefined
  familyName: string | undefined
  profileImageUrl: string | undefined
  email: string | undefined
  disabled: boolean
}>

async function editUserAction(context: PageLoaderContext, { userName, ...data }: UpdateUserData) {
  const sessionResult = await ensureSession(context, 'user', 'write')
  if (sessionResult[0] !== 'k') {
    return sessionResult
  }

  const user = await updateUser(userName, data)
  // revalidatePath('/admin/users')
  // revalidatePath(`/admin/users/${id}`)
  return ok(user)
}

export default editUserAction
