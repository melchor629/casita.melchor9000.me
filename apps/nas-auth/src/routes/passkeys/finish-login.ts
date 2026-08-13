import { verifyAuthenticationResponse, type AuthenticationResponseJSON, type WebAuthnCredential } from '@simplewebauthn/server'
import findLoginInfoForPasskey from '#queries/login/find-login-info-for-passkey.ts'
import oidc from '../../oidc/oidc.ts'
import type { Controller, GenericRoute } from '../models.ts'

interface Route extends GenericRoute {
  Body: {
    data: AuthenticationResponseJSON
  }
  Reply: {
    200: { verified: false } | { verified: true, location: string }
    400: { message: string }
  }
}

const finishPasskeyLoginController: Controller<Route> = async (req, res) => {
  const interaction = await req.trace(
    'interaction details',
    {},
    () => oidc.interactionDetails(req.raw, res.raw),
  )
  const { prompt } = interaction
  if (prompt.name !== 'login') {
    return res.status(400).send({ message: 'Interaction is not a login' })
  }

  const challenge = req.session.get('passkeyChallenge')
  if (!challenge) {
    return res.status(400).send({ message: 'No passkey login started' })
  }

  const login = await findLoginInfoForPasskey(req.body.data.id)
  if (!login || login.disabled) {
    return res.status(400).send({ message: 'No passkey found' })
  }

  if (login.user.disabled) {
    return res.status(400).send({ message: 'User is disabled! Please contact the administrator.' })
  }

  const credential = (login.data as { credential: WebAuthnCredential }).credential
  credential.publicKey = Buffer.from(credential.publicKey as unknown as string, 'base64')
  const verification = await verifyAuthenticationResponse({
    expectedRPID: new URL(oidc.issuer).hostname,
    expectedChallenge: challenge,
    expectedOrigin: new URL(oidc.issuer).origin,
    response: req.body.data,
    credential: (login.data as { credential: WebAuthnCredential }).credential,
  })

  req.session.set('passkeyChallenge', undefined)
  await req.session.save()

  if (verification.verified) {
    const returnTo = await oidc.interactionResult(
      req.raw,
      res.raw,
      { login: { accountId: login.user.userName } },
      { mergeWithLastSubmission: false },
    )
    await res.status(200).send({ verified: true, location: returnTo })
  }

  await res.status(200).send({ verified: false })
}

finishPasskeyLoginController.options = {
  config: {
    rateLimit: {
      max: 6,
      ban: 12,
      timeWindow: '1min',
      groupId: 'passkeys:login',
    },
  },
}

export default finishPasskeyLoginController
