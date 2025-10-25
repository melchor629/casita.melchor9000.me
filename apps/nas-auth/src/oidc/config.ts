import fs from 'fs'
import { errors, type Adapter, type Configuration, type JWKS } from 'oidc-provider'
import { cookieKeysOauth, jwksFilePath, publicUrl } from '../config.ts'
import getApiResource from '../queries/get-api-resource.ts'
import getUser from '../queries/get-user.ts'
import GraphQLClientAdapter from './graphql-client-adapter.ts'
import RedisAdapter from './redis-adapter.ts'

const corsProp = 'urn:custom:client:allowed-cors-origins'
const allowedApiResourcesProp = 'urn:custom:client:allowed-api-resources'
const defaultApiResourcesProp = 'urn:custom:client:default-api-resources'
const setPkceOptionalProp = 'urn:custom:client:set-pkce-optional'
const isOrigin = (value: unknown) => {
  if (typeof value !== 'string') {
    return false
  }

  try {
    const { origin } = new URL(value)
    return value === origin
  } catch {
    return false
  }
}

const config: Configuration = {
  // store some information in expirable storage (redis)
  adapter: (name): Adapter => {
    if (name === 'Client') {
      return new GraphQLClientAdapter()
    }

    return new RedisAdapter(name)
  },

  // list of static clients
  clients: [
    {
      client_id: 'nas-auth',
      client_name: 'NAS Auth',
      client_uri: publicUrl,
      logo_uri: new URL('icon.png', publicUrl).toString(),
      grant_types: ['implicit', 'authorization_code'],
      response_types: ['id_token', 'code'],
      token_endpoint_auth_method: 'none',
      redirect_uris: [publicUrl.startsWith('https:') ? publicUrl : 'https://jwt.io'],
      post_logout_redirect_uris: [publicUrl.startsWith('https:') ? publicUrl : 'https://jwt.io'],
      id_token_signed_response_alg: 'ES256',
      [corsProp]: ['https://jwt.io'],
    },
  ],

  // keys to sign cookies
  cookies: {
    keys: cookieKeysOauth,
    long: {
      httpOnly: true,
      overwrite: true,
      sameSite: 'lax',
      secure: publicUrl.startsWith('https:'),
      signed: true,
    },
    short: {
      httpOnly: true,
      overwrite: true,
      sameSite: 'lax',
      secure: publicUrl.startsWith('https:'),
      signed: true,
    },
    names: {
      interaction: 'auth_i',
      resume: 'auth_ir',
      session: 'auth_sess',
      state: 'auth_st',
    },
  },

  // Json Web Key Store
  jwks: fs.existsSync(jwksFilePath)
    ? JSON.parse(fs.readFileSync(jwksFilePath, { encoding: 'utf-8' })) as JWKS
    : { keys: [] },

  // tell the which scopes do we support
  claims: {
    openid: ['sub'],
    email: ['email', 'email_verified'],
    profile: ['family_name', 'given_name', 'name'],
  },

  // function to find accounts with their claims
  findAccount: (_ctx, id) => ({
    accountId: id,
    async claims() {
      const user = await getUser(id)

      if (user == null) {
        return { sub: id }
      }

      return {
        sub: user.userName,
        email: user.email,
        email_verified: true,
        name: user.displayName || `${user.givenName} ${user.familyName}`,
        family_name: user.familyName,
        given_name: user.givenName,
      }
    },
  }),

  // tell oidc which are the interactions URLs
  interactions: {
    url(_, { uid }) {
      return `/i/${uid}`
    },
  },

  features: {
    // enable client_credentials grant type
    clientCredentials: { enabled: true },
    // disable the packaged interactions
    devInteractions: { enabled: false },
    // api resources
    resourceIndicators: {
      enabled: true,
      defaultResource(_ctx, client, oneOf) {
        return oneOf || client[defaultApiResourcesProp] as string
      },
      async getResourceServerInfo(_ctx, resource, client) {
        const { [allowedApiResourcesProp]: allowedApiResources } = client
        if (!Array.isArray(allowedApiResources) || !allowedApiResources.includes(resource)) {
          throw new errors.InvalidTarget(`The Client '${client.clientId}' cannot access API Resource '${resource}'`)
        }

        const apiResource = await getApiResource(resource)
        if (apiResource) {
          return apiResource
        }

        throw new errors.InvalidTarget(`API Resource '${resource}' is not registered`)
      },
      useGrantedResource(ctx, model) {
        if (ctx.oidc.client && model.kind === 'AuthorizationCode') {
          return (ctx.oidc.client[allowedApiResourcesProp] as string[] | null)?.length === 1
        }

        return false
      },
    },
    // enable revokation for refresh tokens
    revocation: { enabled: true },
    // logout interactions
    rpInitiatedLogout: {
      async logoutSource() {
        // NOTE implement outside next
      },
      async postLogoutSuccessSource() {
        // NOTE implement outside next
      },
    },
    // par endpoint
    pushedAuthorizationRequests: {
      enabled: true,
    },
    // userinfo endpoint
    userinfo: { enabled: true },
  },

  // extra client metadata
  extraClientMetadata: {
    properties: [corsProp, allowedApiResourcesProp, defaultApiResourcesProp, setPkceOptionalProp],
    validator(_, key, value, metadata) {
      // validate cors prop
      if (key === corsProp) {
        // if value is empty, fill with empty array
        if (value == null) {
          metadata[corsProp] = []
          return
        }

        // validate array of origins
        if (!Array.isArray(value) || !value.every(isOrigin)) {
          throw new errors.InvalidClientMetadata(`${corsProp} must be an array of origins`)
        }
      }

      // validate allowed api resources prop
      if (key === allowedApiResourcesProp) {
        // if value is empty, fill with empty array or with default api resource
        if (value == null) {
          metadata[allowedApiResourcesProp] = metadata[defaultApiResourcesProp]
            ? [metadata[defaultApiResourcesProp]]
            : []
          return
        }

        // validate array of api resources
        if (!Array.isArray(value) || !value.every((v) => typeof v === 'string')) {
          throw new errors.InvalidClientMetadata(`${allowedApiResourcesProp} must be an array of strings`)
        }
      }

      // validate default api resource prop
      if (key === defaultApiResourcesProp) {
        if (value != null && !(typeof value === 'string')) {
          throw new errors.InvalidClientMetadata(`${defaultApiResourcesProp} must be a string`)
        }
      }

      if (key === setPkceOptionalProp) {
        if (value != null && !(typeof value === 'boolean')) {
          throw new errors.InvalidClientMetadata(`${setPkceOptionalProp} must be a boolean`)
        }
      }
    },
  },

  // configure CORS based on clients
  clientBasedCORS(_, origin, client) {
    // TODO improve?
    return (client[corsProp] as string[]).includes(origin)
  },

  pkce: {
    required(_, client) {
      return client[setPkceOptionalProp] !== true
    },
  },

  // configure TTLs
  ttl: {
    AccessToken(_, token) {
      if (token.resourceServer) {
        return token.resourceServer.accessTokenTTL || 60 * 60 // 1 hour in seconds
      }
      return 60 * 60 // 1 hour in seconds
    },
    AuthorizationCode: 600 /* 10 minutes in seconds */,
    BackchannelAuthenticationRequest(ctx) {
      if (ctx && ctx.oidc && ctx.oidc.params?.requested_expiry) {
        // 10 minutes in seconds or requested_expiry, whichever is shorter
        return Math.min(10 * 60, +ctx.oidc.params.requested_expiry)
      }

      return 10 * 60 // 10 minutes in seconds
    },
    ClientCredentials(_, token) {
      if (token.resourceServer) {
        return token.resourceServer.accessTokenTTL || 10 * 60 // 10 minutes in seconds
      }
      return 10 * 60 // 10 minutes in seconds
    },
    DeviceCode: 600 /* 10 minutes in seconds */,
    Grant: 1209600 /* 14 days in seconds */,
    IdToken: 3600 /* 1 hour in seconds */,
    Interaction: 300 /* 5 minutes in seconds */,
    RefreshToken(ctx, token, client) {
      if (
        ctx
          && ctx.oidc.entities.RotatedRefreshToken
          && client.applicationType === 'web'
          && client.tokenEndpointAuthMethod === 'none'
          && !token.isSenderConstrained()
      ) {
        // Non-Sender Constrained SPA RefreshTokens do not have infinite expiration through rotation
        return ctx.oidc.entities.RotatedRefreshToken.remainingTTL
      }

      return 14 * 24 * 60 * 60 // 14 days in seconds
    },
    Session: 1209600, /* 14 days in seconds */
  },

  // helper function to load existing grants or create ones with pre-stablished values
  async loadExistingGrant(ctx) {
    const grantId = ctx.oidc.result?.consent?.grantId
      || ctx.oidc.session?.grantIdFor(ctx.oidc.client!.clientId)
    let grant
    if (grantId) {
      grant = await ctx.oidc.provider.Grant.find(grantId)
    } else if (ctx.oidc.account) {
      grant = new ctx.oidc.provider.Grant({
        accountId: ctx.oidc.account.accountId,
        clientId: ctx.oidc.client!.clientId,
      })
    }

    if (grant) {
      const assignedScopes = grant.getOIDCScope().split(' ')

      if (!assignedScopes.includes('openid')) {
        grant.addOIDCScope('openid')
      }

      if (!assignedScopes.includes('profile')) {
        grant.addOIDCScope('profile')
      }

      if (!assignedScopes.includes('email')) {
        grant.addOIDCScope('email')
      }

      await grant.save()
    }

    return grant
  },

  // a function to render the error page
  async renderError() {
    // NOTE implement outside next
  },
}

export default config
