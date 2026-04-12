import type { PageLoaderContext } from '@melchor629/nice-ssr'
import createLogin from '#queries/create-login.ts'
import deleteLogin from '#queries/delete-login.ts'
import getUser from '#queries/get-user.ts'
import { getSession } from './get-session-action'
import { ok, invalid, type FailableValidationFields } from './helpers.ts'

const mkpasswd = async (username: string, password: string) => {
  const loginIdPreHash = Buffer.from(`_${password}@${username}_`, 'utf-8')
  const loginIdHashed = await crypto.subtle.digest('SHA-512', loginIdPreHash)
  return Buffer.from(loginIdHashed).toString('hex')
}

async function changeUserPasswordAction(context: PageLoaderContext, form: FormData) {
  const session = await getSession(context)
  if (!session) {
    return invalid([])
  }

  const user = (await getUser(session.accountId, { logins: true }))!
  const currentPassword = form.get('currentPassword')
  const newPassword1 = form.get('newPassword1')
  const newPassword2 = form.get('newPassword2')

  const validations: FailableValidationFields[0][] = []
  let loginid: number | undefined
  if (typeof currentPassword === 'string') {
    const loginId = await mkpasswd(user.userName, currentPassword)
    const login = user.logins?.find((v) => v.type === 'local' && v.loginId === loginId)
    if (!login) {
      validations.push({ name: 'currentPassword', messages: ['The password is incorrect'] })
    } else {
      loginid = login.id
    }
  }

  if (typeof newPassword1 !== 'string' || !newPassword1) {
    validations.push({ name: 'newPassword1', messages: ['Please fill the new password'] })
  }

  if (typeof newPassword2 !== 'string' || !newPassword2) {
    validations.push({ name: 'newPassword2', messages: ['Please fill the new password, again'] })
  } else if (newPassword2 !== newPassword1) {
    validations.push({ name: 'newPassword2', messages: ['Password does not match with the above one'] })
  } else if (newPassword1 === currentPassword) {
    validations.push({ name: 'newPassword1', messages: ['The password must be different from the previous one'] })
  } else if (newPassword1.length < 6) {
    validations.push({ name: 'newPassword1', messages: ['The password must have at least 6 characters'] })
  } else if (!newPassword1.match(/[a-z]/) || !newPassword1.match(/[A-Z]/) || !newPassword1.match(/\d/)) {
    validations.push({ name: 'newPassword1', messages: ['The password must have at least one lower case, upper case, digit characters'] })
  }

  if (validations.length > 0) {
    return invalid(validations)
  }

  if (loginid) {
    await deleteLogin(loginid)
  }

  await createLogin({
    loginId: await mkpasswd(user.userName, newPassword1 as string),
    type: 'local',
    userId: user.id,
    disabled: false,
  })
  return ok(true)
}

export default changeUserPasswordAction
