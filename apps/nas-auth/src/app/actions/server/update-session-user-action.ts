'use server'

import type { PageLoaderContext } from '@melchor629/nice-ssr'
import { updateUser } from '../../queries'
import { getSession } from './get-session-action'
import { ok, invalid } from './helpers'

type Data = Readonly<{
  displayName?: string
  givenName?: string
  familyName?: string
  profileImageUrl?: string
  origin: string
}>

const updateSessionUserAction = async function updateSessionUserAction(request: PageLoaderContext, user: Data) {
  const session = await getSession(request)
  if (!session) {
    return invalid([])
  }

  const fieldsToUpdate: Record<string, string | URL> = {}
  if (user.displayName) {
    fieldsToUpdate.displayName = user.displayName
  }
  if (user.givenName) {
    fieldsToUpdate.givenName = user.givenName
  }
  if (user.familyName) {
    fieldsToUpdate.familyName = user.familyName
  }
  if (user.profileImageUrl && URL.canParse(user.profileImageUrl, user.origin)) {
    fieldsToUpdate.profileImageUrl = new URL(
      user.profileImageUrl,
      user.origin,
    )
  }

  const updatedUser = await updateUser(session.user.id, fieldsToUpdate)
  return ok({
    id: updatedUser.id,
    userName: updatedUser.userName,
    displayName: updatedUser.displayName,
    givenName: updatedUser.givenName || undefined,
    familyName: updatedUser.familyName || undefined,
    email: updatedUser.email || undefined,
    profileImageUrl: updatedUser.profileImageUrl || undefined,
    disabled: updatedUser.disabled,
  })
}

export default updateSessionUserAction
