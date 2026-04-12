import { generateAuthenticationOptions } from '@simplewebauthn/server'
import oidc from '../../oidc/oidc.ts'
import type { Controller, GenericRoute } from '../models.ts'

interface Route extends GenericRoute {
  Body: void
  Reply: {
    200: PublicKeyCredentialRequestOptionsJSON
    400: void
  }
}

const startPasskeyLoginController: Controller<Route> = async (req, res) => {
  const interaction = await req.trace(
    'interaction details',
    {},
    () => oidc.interactionDetails(req.raw, res.raw),
  )
  const { prompt } = interaction
  if (prompt.name !== 'login') {
    return res.status(400).send({ message: 'Interaction is not a login' })
  }

  const options = await generateAuthenticationOptions({
    rpID: new URL(oidc.issuer).hostname,
    userVerification: 'preferred',
  })

  req.session.set('passkeyChallenge', options.challenge)
  await req.session.save()
  await res.status(200).send(options)
}

startPasskeyLoginController.options = {
  config: {
    rateLimit: {
      max: 6,
      ban: 12,
      timeWindow: '1min',
      groupId: 'passkeys:login',
    },
  },
}

export default startPasskeyLoginController
