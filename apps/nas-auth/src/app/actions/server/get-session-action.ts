'use server'

import type { IncomingMessage, ServerResponse } from 'node:http'
import { cache, type PageLoaderContext } from '@melchor629/nice-ssr'
import { getPermissionsForUser, getUser } from '#queries/index.ts'
import oidc from '../../../oidc/oidc.ts'
import { forbidden, ok, type FailableResult } from './helpers.ts'

type SessionInfo = Readonly<{
  accountId: string
  user: {
    userName: string
    displayName: string
    givenName?: string
    familyName?: string
    email?: string
    profileImageUrl?: string
    disabled: boolean
    logins: Array<{
      id: string
      type: 'github' | 'google' | 'local' | 'passkey'
      name?: string | null
      disabled: boolean
    }>
  }
  permissions: Array<{
    key: string
    write: boolean
    delete: boolean
  }>
}>

const extractNameFromLoginData = (data: unknown) => {
  if (!data || typeof data !== 'object') return undefined
  if (!('profile' in data) || typeof data.profile !== 'object' || !data.profile) return undefined
  if ('username' in data.profile && typeof data.profile.username === 'string') return data.profile.username
  if ('name' in data.profile && typeof data.profile.name === 'string') return data.profile.name
  return undefined
}

export const getSession = cache(async function getSession(request: PageLoaderContext): Promise<SessionInfo | null> {
  const h = request.headers
  const req = {
    socket: { encrypted: false },
    headers: {
      cookie: h.get('cookie'),
      'X-Forwarded-Proto': h.get('X-Forwarded-Proto'),
    },
  } as unknown as IncomingMessage
  const res = {} as ServerResponse
  const ctx = oidc.createContext(req, res)
  const session = await oidc.Session.get(ctx)
  if (!session.accountId) {
    return null
  }

  const [user, permissions] = await Promise.all([
    getUser({ userName: session.accountId }, { logins: true }),
    getPermissionsForUser(session.accountId),
  ])
  return {
    accountId: session.accountId,
    user: {
      userName: user!.userName,
      displayName: user!.displayName,
      givenName: user!.givenName || undefined,
      familyName: user!.familyName || undefined,
      email: user!.email || undefined,
      profileImageUrl: user!.profileImageUrl || undefined,
      disabled: user!.disabled,
      logins: user!.logins?.map((l) => ({
        id: l.loginId,
        name: extractNameFromLoginData(l.data),
        type: l.type as never,
        disabled: l.disabled,
      })) || [],
    },
    permissions: permissions.permissions
      .filter((perm) => perm.applicationKey === 'auth')
      .map((perm) => ({
        key: perm.name,
        write: perm.write,
        delete: perm.delete,
      })),
  }
})

export const ensureSession = async (
  request: PageLoaderContext,
  permission: 'application' | 'client' | 'user',
  action?: 'write' | 'delete',
) => {
  const session = await getSession(request)
  if (!session) {
    return forbidden('who am i?')
  }

  const perm = session.permissions.find((p) => p.key === permission)
  if (!perm) {
    return forbidden('Not allowed to access this resource')
  }

  if (action && !perm[action]) {
    return forbidden('Not allowed to perform this action')
  }

  return ok(session)
}

async function getSessionAction(request: PageLoaderContext): Promise<FailableResult<SessionInfo | null>> {
  return ok(await getSession(request))
}

export default getSessionAction
