import oauthPlugin, { type OAuth2Namespace } from '@fastify/oauth2'
import type { FastifyRequest } from 'fastify'
import { fastifyPlugin } from 'fastify-plugin'
import { decodeJwt } from 'jose'
import { githubClientId, githubClientSecret, googleClientId, googleClientSecret } from '../config.ts'

declare module 'fastify' {
  interface FastifyInstance {
    google: OAuth2Namespace
    github: OAuth2Namespace
  }
}

const providers = Object.freeze(['google', 'github'] as const)
type ProviderType = (typeof providers)[number]

const callbackUri = (req: FastifyRequest, provider: ProviderType) => {
  let port: number | string = req.port ?? ''
  if (req.protocol === 'http' && port === 80) {
    port = ''
  } else if (req.protocol === 'https' && port === 443) {
    port = ''
  } else if (typeof port === 'number') {
    port = `:${port}`
  }

  return `${req.protocol}://${req.hostname}${port}/auth/${provider}/callback`
}

const Oauth2Plugin = fastifyPlugin(async (app) => {
  if (googleClientId && googleClientSecret) {
    await app.register(oauthPlugin, {
      name: 'google',
      credentials: {
        client: {
          id: googleClientId,
          secret: googleClientSecret,
        },
      },
      discovery: {
        issuer: 'https://accounts.google.com',
      },
      scope: ['openid', 'profile', 'email'],
      pkce: 'S256',
      callbackUri: (req) => callbackUri(req, 'google'),
    })
  }

  if (githubClientId && githubClientSecret) {
    await app.register(oauthPlugin, {
      name: 'github',
      credentials: {
        auth: oauthPlugin.GITHUB_CONFIGURATION,
        client: {
          id: githubClientId,
          secret: githubClientSecret,
        },
      },
      scope: ['openid', 'profile', 'email'],
      callbackUri: (req) => callbackUri(req, 'github'),
    })
  }

  app.get<{
    Params: { provider: string }
    Querystring: { uid?: string }
  }>('/auth/:provider', async function(req, reply) {
    const { provider } = req.params
    if (!providers.includes(provider as never) || !req.query.uid || !(provider in this)) {
      return reply.status(400).send()
    }

    req.session.set('login', { provider, interactionId: req.query.uid })
    await req.session.save()
    const uri = await this[provider as ProviderType].generateAuthorizationUri(req, reply)
    await reply.redirect(uri)
  })
  app.get<{
    Params: { provider: string }
  }>('/auth/:provider/callback', async function(req, reply) {
    const login = req.session.get('login')
    if (!login || login.provider !== req.params.provider || !(login.provider in this)) {
      return reply.status(400).send()
    }

    const provider = this[login.provider as ProviderType]
    const { token } = await provider.getAccessTokenFromAuthorizationCodeFlow(req)
    let profile: Record<string, unknown>
    if (login.provider === 'github') {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      const userinfo = await res.json() as Record<string, unknown>
      profile = {
        userinfo,
        email: userinfo.email,
        sub: (userinfo.id as number).toString(),
        username: userinfo.login,
        name: userinfo.name,
        picture: userinfo.avatar_url,
      }
    } else if (token.id_token) {
      profile = decodeJwt<Record<string, unknown>>(token.id_token)
    } else {
      profile = await provider.userinfo(token) as Record<string, unknown>
    }

    req.session.set('login', undefined)
    req.session.set('loginResult', { provider: login.provider, profile, token })
    await req.session.save()
    await reply.redirect(`/i/${login.interactionId}/post-external`)
  })
}, { name: 'oauth2' })

export default Oauth2Plugin
