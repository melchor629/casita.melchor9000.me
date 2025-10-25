import oidc from '../../oidc/oidc.ts'
import findLoginInfoForUsernameAndPassword from '../../queries/find-login-info-for-username-and-password.ts'
import type { Controller, GenericRoute } from '../models.ts'

interface Route extends GenericRoute {
  Body: { username: string, password: string }
  Reply:
    | string
    | { message: string }
}

const userPasswordLoginController: Controller<Route> = async (req, res) => {
  const interaction = await req.trace(
    'interaction details',
    {},
    () => oidc.interactionDetails(req.raw, res.raw),
  )
  const { prompt, uid } = interaction
  if (prompt.name !== 'login') {
    return res.status(400).send({ message: 'Interaction is not a login' })
  }

  const login = await findLoginInfoForUsernameAndPassword(
    req.body.username,
    req.body.password,
  )

  if (!login) {
    interaction.params.login_hint = req.body.username
    interaction.params.login_error = 'Invalid email or password!'
    await interaction.save(interaction.exp)
    return res.redirect(`/i/${uid}`).send('Redirecting...')
  }

  await req.trace('interaction finished', {}, () => oidc.interactionFinished(
    req.raw,
    res.raw,
    { login: { accountId: login.user.userName } },
    { mergeWithLastSubmission: false },
  ))
}

userPasswordLoginController.options = {}

export default userPasswordLoginController
