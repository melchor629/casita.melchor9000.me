import type { ServerResponse } from 'node:http'
import type { FastifyReply } from 'fastify'
import { Provider } from 'oidc-provider'
import { publicUrl } from '../config.ts'
import config from './config.ts'

type OidcServerResponse = ServerResponse & {
  reply: FastifyReply
}

const oidc = new Provider(publicUrl, {
  ...config,

  features: {
    ...config.features,
    // logout interactions
    rpInitiatedLogout: {
      async logoutSource(ctx, form) {
        const { reply } = ctx.res as OidcServerResponse
        // I trust form to not doing unsecure things
        const response = await reply.renderPageToResponse('/i/logout', { props: { form } })
        ctx.body = await response.text()
      },
      async postLogoutSuccessSource(ctx) {
        const { reply } = ctx.res as OidcServerResponse
        const response = await reply.renderPageToResponse('/i/post-logout', {
          props: {
            clientName: ctx.oidc.client?.clientName || '',
            clientUri: ctx.oidc.client?.clientUri || '',
          },
        })
        ctx.body = await response.text()
      },
    },
  },

  // a function to render the error page
  async renderError(ctx, out, error) {
    const { reply } = ctx.res as OidcServerResponse
    ctx.type = 'html'
    reply.log.error(error, 'OIDC Interaction failed', { route: ctx.oidc?.route })
    const response = await reply.renderPageToResponse('/i/error', { props: { out } })
    ctx.body = await response.text()
  },
})

oidc.proxy = true

export default oidc
