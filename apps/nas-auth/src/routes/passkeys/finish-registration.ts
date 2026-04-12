import { verifyRegistrationResponse, type RegistrationResponseJSON } from '@simplewebauthn/server'
import createLogin from '#queries/create-login.ts'
import getUser from '#queries/get-user.ts'
import oidc from '../../oidc/oidc.ts'
import type { Controller, GenericRoute } from '../models.ts'

interface Route extends GenericRoute {
  Body: {
    name: string
    data: RegistrationResponseJSON
  }
  Reply: {
    200: { verified: boolean }
    401: void
  }
}

const finishPasskeyRegistrationController: Controller<Route> = async (req, res) => {
  const ctx = oidc.createContext(req.raw, res.raw)
  const session = await oidc.Session.get(ctx)
  if (!session.accountId) {
    return res.status(401).send()
  }

  const challenge = req.session.get('passkeyChallenge')
  if (!challenge) {
    return res.status(401).send()
  }

  const verification = await verifyRegistrationResponse({
    response: req.body.data,
    expectedChallenge: challenge,
    expectedOrigin: new URL(oidc.issuer).origin,
    expectedRPID: new URL(oidc.issuer).hostname,
  })

  if (verification.verified) {
    const user = await getUser(session.accountId)
    if (!user) {
      return res.status(401).send()
    }

    await createLogin({
      loginId: verification.registrationInfo.credential.id,
      type: 'passkey',
      userId: user.id,
      data: {
        profile: { name: req.body.name },
        ...verification.registrationInfo,
        attestationObject: Buffer.from(verification.registrationInfo.attestationObject).toString('base64'),
        credential: {
          ...verification.registrationInfo.credential,
          publicKey: Buffer.from(verification.registrationInfo.credential.publicKey).toString('base64'),
        },
      },
    })
  }

  req.session.set('passkeyChallenge', undefined)
  await req.session.save()
  await res.status(200).send({
    verified: verification.verified,
  })
}

finishPasskeyRegistrationController.options = {
  config: {
    rateLimit: {
      max: 4,
      ban: 10,
      timeWindow: '1min',
      groupId: 'passkeys:registration',
    },
  },
}

export default finishPasskeyRegistrationController
