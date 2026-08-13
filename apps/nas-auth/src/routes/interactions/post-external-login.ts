import oidc from '../../oidc/oidc.ts'
import {
  createLogin,
  findLoginInfoForExternalAuth,
  findUser,
  getUser,
  updateLogin,
  updateUser,
} from '../../queries/index.ts'
import type { Controller, GenericRoute } from '../models.ts'

interface Route extends GenericRoute {
  Reply: string
}

const postExternalLoginController: Controller<Route> = async (req, res) => {
  const failInteraction = async (errorMessage: string) => {
    const interaction = await req.trace(
      'interaction details',
      {},
      () => oidc.interactionDetails(req.raw, res.raw),
    )
    interaction.params.login_error = errorMessage
    await req.trace('save interaction', {}, () => interaction.save(interaction.exp))
    await res.redirect(`/i/${interaction.uid}`).send('Redirecting...')
  }

  const loginResult = req.session.get('loginResult')
  if (!loginResult) {
    return failInteraction('No matching state')
  }

  const { provider, token } = loginResult
  const profile = loginResult.profile as Record<string, string>
  const displayName = profile.name
    || ([profile.given_name, profile.family_name].filter((s) => s).join(' '))
    || profile.username
    || profile.email?.split('@')[0]
    || profile.sub
  const userName = profile.username
    || profile.email?.split('@')[0]
    || profile.name?.toLowerCase().split(' ').join('_')
    || profile.sub

  const loginId = profile.sub ?? profile.login
  let login = await findLoginInfoForExternalAuth(provider, loginId)
  let user

  if (login) {
    user = await getUser(login, {})
  } else {
    user = await findUser({ displayName, userName, email: profile.email })
  }

  if (user == null || user?.disabled) {
    req.log.warn({
      loginResult,
      status: user?.disabled ? 'disabled' : 'not-registered',
      loginId,
    }, 'The user cannot log in')
    await failInteraction('Your user is disabled! Contact to the administrator.')
    return
  }

  if (!login) {
    login = await createLogin({
      data: { profile, token },
      disabled: false,
      loginId,
      type: provider,
      userName: user.userName,
    })
  } else if (login.disabled) {
    req.log.warn({
      loginResult,
      status: 'login-disabled',
      loginId,
    }, 'The user cannot log in')
    await failInteraction(`The provider '${provider}' is disabled for you! Please contact the administrator.`)
    return
  } else {
    login = await updateLogin(login.type, login.loginId, { data: { profile, token } })
  }

  const propertiesToUpdateInUser: ['givenName' | 'familyName' | 'profileImageUrl' | 'displayName', string][] = []
  if (!user.givenName && profile.given_name) {
    propertiesToUpdateInUser.push(['givenName', profile.given_name])
  }
  if (!user.familyName && profile.family_name) {
    propertiesToUpdateInUser.push(['familyName', profile.family_name])
  }
  if (!user.profileImageUrl && profile.picture) {
    propertiesToUpdateInUser.push(['profileImageUrl', profile.picture])
  }
  if (!user.displayName && profile.name) {
    propertiesToUpdateInUser.push(['displayName', profile.name])
  }

  if (propertiesToUpdateInUser.length) {
    await updateUser(user.userName, Object.fromEntries(propertiesToUpdateInUser))
  }

  req.session.set('loginResult', undefined)
  await req.session.save()
  await req.trace('interaction finished', {}, () => oidc.interactionFinished(
    req.raw,
    res.raw,
    { login: { accountId: user.userName } },
    { mergeWithLastSubmission: false },
  ))
}

postExternalLoginController.options = {
  config: {
    rateLimit: {
      max: 3,
      ban: 10,
      timeWindow: '1min',
      groupId: 'login',
    },
  },
}

export default postExternalLoginController
