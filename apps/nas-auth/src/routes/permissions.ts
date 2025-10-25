import { createRemoteJWKSet, jwtVerify } from 'jose'
import { publicUrl } from '../config.ts'
import oidc from '../oidc/oidc.ts'
import getPermissionsForUser, { type PermissionsForUser } from '../queries/get-permissions-for-user.ts'
import type { Controller, GenericRoute } from './models.ts'

interface Route extends GenericRoute {
  Reply:
    | PermissionsForUser
    | { message: string, statusCode: number }
}

const jwks = createRemoteJWKSet(new URL(`${publicUrl}/oidc/jwks`))

const getPermissionsForToken: Controller<Route> = async (req, res) => {
  if (req.routeOptions.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
    res.header('Access-Control-Allow-Methods', 'GET')
    res.header('Access-Control-Allow-Headers', 'Authorization')
    return res.send()
  }

  const token = req.headers.authorization?.substring(7)
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized', statusCode: 401 })
  }

  const { payload: { client_id: clientId, sub } } = await req.trace(
    'getPermissions jwt verify',
    {},
    () => jwtVerify(token, jwks, { issuer: publicUrl }),
  )
  if (!sub) {
    return res.status(400).send({
      message: 'This token does not belong to a user',
      statusCode: 400,
    })
  }

  if (typeof clientId === 'string') {
    const client = await req.trace(
      'getPermissions getClient',
      {},
      () => oidc.Client.find(clientId),
    )
    const origins = client?.['urn:custom:client:allowed-cors-origins'] as string[] | undefined
    if (origins?.length && origins.includes(req.headers.origin || '')) {
      res.header('Access-Control-Allow-Origin', req.headers.origin)
      res.header('Access-Control-Allow-Methods', 'GET')
      res.header('Access-Control-Allow-Headers', 'Authorization')
    }
  }

  const response = await req.trace(
    'get-permissions',
    {},
    () => getPermissionsForUser(sub),
  )
  return res.send(response)
}

getPermissionsForToken.options = {}

export default getPermissionsForToken
