import { generateRegistrationOptions } from '@simplewebauthn/server'
import getUser from '#queries/user/get-user.ts'
import oidc from '../../oidc/oidc.ts'
import type { Controller, GenericRoute } from '../models.ts'

interface Route extends GenericRoute {
  Body: void
  Reply: {
    200: PublicKeyCredentialCreationOptionsJSON
    401: void
  }
}

const startPasskeyRegistrationController: Controller<Route> = async (req, res) => {
  const ctx = oidc.createContext(req.raw, res.raw)
  const session = await oidc.Session.get(ctx)
  if (!session.accountId) {
    return res.status(401).send()
  }

  const user = await getUser({ userName: session.accountId }, { logins: true })
  const options = await generateRegistrationOptions({
    rpName: 'NAS Auth',
    rpID: new URL(oidc.issuer).hostname,
    userName: session.accountId,
    attestationType: 'none',
    authenticatorSelection: {
      residentKey: 'required',
      userVerification: 'preferred',
    },
    excludeCredentials: user?.logins
      ?.filter((e) => e.type === 'passkey')
      .map((e) => ({ id: e.loginId })),
  })

  req.session.set('passkeyChallenge', options.challenge)
  await req.session.save()
  await res.status(200).send(options)
}

startPasskeyRegistrationController.options = {
  config: {
    rateLimit: {
      max: 4,
      ban: 10,
      timeWindow: '1min',
      groupId: 'passkeys:registration',
    },
  },
}

export default startPasskeyRegistrationController
