import type { PageLoaderContext } from '@melchor629/nice-ssr'
import getUser from '#queries/get-user.ts'
import updateLogin from '#queries/update-login.ts'
import { getSession } from './get-session-action'
import { ok, invalid } from './helpers.ts'

type ToggleUserLoginOptions = Readonly<{
  id: string
  type: string
}>

async function toggleUserLoginAction(context: PageLoaderContext, { id, type }: ToggleUserLoginOptions) {
  const session = await getSession(context)
  if (!session) {
    return invalid([])
  }

  const user = (await getUser(session.accountId, { logins: true }))!
  const login = user.logins?.find((l) => l.type === type && l.loginId === id)
  if (!login) {
    return invalid([])
  }

  await updateLogin(login.id, {
    disabled: !login.disabled,
  })
  return ok(!login.disabled)
}

export default toggleUserLoginAction
