import oidc from '../../oidc/oidc.ts'
import {
  // createLogin,
  createLoginAndUpdateUser,
  // createUser,
  findLoginInfoForExternalAuth,
  getUser,
  updateLoginData,
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

  let { login, user } = await findLoginInfoForExternalAuth(
    provider,
    profile.sub ?? profile.login,
    displayName,
    userName,
    profile.email,
  )

  if (user?.disabled) {
    await failInteraction('Your user is disabled!')
    return
  }

  if (login) {
    await updateLoginData(login.id, { profile, token })

    if (login.disabled) {
      await failInteraction(`You cannot log in using '${provider}'!`)
      return
    }

    user ??= await getUser({ id: login.user.id })
  } else if (user) {
    await createLoginAndUpdateUser({
      id: user.id,
      displayName,
      email: profile.email,
      givenName: user.givenName ?? profile.given_name,
      familyName: user.familyName ?? profile.family_name,
      profileImageUrl: user.profileImageUrl ?? profile.picture,
    }, provider, profile.sub ?? profile.name, { profile, token })
  } else {
    /*
    const newUser = await createUser({
      userName,
      displayName,
      email,
      givenName: profile.given_name,
      familyName: profile.family_name,
      profilePictureUrl: profile.picture,
    })

    const newLogin = await createLogin({
      userId: newUser.id,
      data: profile,
      loginId: profile.sub,
      type: provider,
    })

    user = newUser
    login = newLogin
    */

    req.log.warn({ loginResult }, 'User not present in system')
    await failInteraction(
      `The user ${userName} is not registered in the system. You cannot log in! Contact the administrator...`,
    )
    return
  }

  const propertiesToUpdateInUser: ['givenName' | 'familyName' | 'profileImageUrl' | 'displayName', string][] = []
  if (!user!.givenName && profile.given_name) {
    propertiesToUpdateInUser.push(['givenName', profile.given_name])
  }
  if (!user!.familyName && profile.family_name) {
    propertiesToUpdateInUser.push(['familyName', profile.family_name])
  }
  if (!user!.profileImageUrl && profile.picture) {
    propertiesToUpdateInUser.push(['profileImageUrl', profile.picture])
  }
  if (!user!.displayName && profile.name) {
    propertiesToUpdateInUser.push(['displayName', profile.name])
  }

  if (propertiesToUpdateInUser.length) {
    await updateUser(user!.id, Object.fromEntries(propertiesToUpdateInUser))
  }

  req.session.set('loginResult', undefined)
  await req.session.save()
  await req.trace('interaction finished', {}, () => oidc.interactionFinished(
    req.raw,
    res.raw,
    { login: { accountId: (login?.user || user)!.userName } },
    { mergeWithLastSubmission: false },
  ))
}

postExternalLoginController.options = {}

export default postExternalLoginController
