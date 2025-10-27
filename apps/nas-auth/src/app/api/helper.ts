import type { IncomingMessage, ServerResponse } from 'node:http'
import { cache, SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'
import { getPermissionsForUser } from '#queries/index.ts'
import oidc from '../../oidc/oidc.ts'

type Permission = { key: string, write: boolean, delete: boolean }
type Permissions = readonly Permission[] & { get(key: string): Permission | null }

export type NextRouteContext = {
  session: (typeof oidc)['Session']['prototype']
  permissions?: Permissions
}

export type NextRouteHandler<Params extends Record<string, string>, Context = unknown> = (
  request: SsrRequest<Params>,
  context: Context,
) => Promise<Response>

export const getSession = cache((headers: Headers) => {
  const req = {
    socket: { encrypted: false },
    headers: {
      cookie: headers.get('cookie'),
      'X-Forwarded-Proto': headers.get('X-Forwarded-Proto'),
    },
  } as unknown as IncomingMessage
  const res = {} as ServerResponse
  const ctx = oidc.app.createContext(req, res)
  return oidc.Session.get(ctx)
})

/**
 * Decorates the handler with the current session if any, optionally blocking the request if there
 * is no session.
 * @param fn Handler to decorate
 * @param options Options for the decorator
 * @returns The decorated handler
 */
export const withSession = <Params extends Record<string, string> = Record<never, string>>(
  fn: NextRouteHandler<Params, NextRouteContext>,
  { ensure }: { ensure?: boolean } = {},
) =>
    async function withSessionDecorator(request: SsrRequest<Params>) {
      const context: NextRouteContext = {
        session: await getSession(request.headers),
      }

      if (!context.session.accountId && ensure) {
        return SsrResponse.json({ error: true, message: 'Forbidden' }, { status: 401 })
      }
      return fn(request, context)
    }

export const getPermissions = cache(async (accountId?: string | null): Promise<Permissions> => {
  if (!accountId) {
    const permissions: Permissions = [] as unknown as Permissions
    permissions.get = () => null
    return Object.freeze(permissions)
  }

  const { permissions } = await getPermissionsForUser(accountId)
  const perms = permissions
    .filter((perm) => perm.applicationKey === 'auth')
    .map((perm): Permission => ({
      key: perm.name,
      write: perm.write,
      delete: perm.delete,
    })) as unknown as Permissions
  perms.get = (key) => perms.find((p) => p.key === key) || null
  return Object.freeze(perms)
})

/**
 * Decorates the handler with the permissions from the current user
 * @param fn Handler to decorate
 * @returns The decorated handler
 */
export const withPermissions = <Params extends Record<string, string> = Record<never, string>>(fn: NextRouteHandler<Params, NextRouteContext>) =>
  async function withPermissionsDecorator(request: SsrRequest<Params>, context: NextRouteContext) {
    const { accountId } = context.session
    context.permissions = await getPermissions(accountId)
    return fn(request, context)
  }
