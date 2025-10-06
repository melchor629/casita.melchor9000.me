import type { FastifyPluginAsync } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import { authApiBaseUrl } from '../config.ts'

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import('@fastify/swagger'), {
    openapi: {
      openapi: '3.1.0',
      info: {
        title: 'NAS FS API',
        description: 'Navigate and share your files and media through a simple API',
        version: fastify.packageJson.version,
      },
      tags: [
        { name: 'default', description: 'Generic operations' },
        { name: 'fs', description: 'Operations related to files and folders' },
        { name: 'jobs', description: 'Operations related to background jobs' },
        { name: 'media', description: 'Operations related to media libraries' },
        { name: 'upload', description: 'Upload fileoperations' },
      ],
      components: {
        securitySchemes: {
          auth: {
            type: 'oauth2',
            description: 'Authenticate using OAuth2 and NAS Auth',
            flows: {
              authorizationCode: {
                authorizationUrl: `${authApiBaseUrl}/oidc/auth`,
                tokenUrl: `${authApiBaseUrl}/oidc/token`,
                scopes: {
                  openid: 'openid',
                  offline_access: 'offline_access',
                },
              },
            },
          },
        },
      },
    },
    transform({ schema, url }) {
      if (url.includes('{wildcard}')) {
        return {
          schema,
          url: url.replace('{wildcard}', '{*}'),
        }
      }

      return { schema, url }
    },
  })

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line import-x/no-extraneous-dependencies
    await fastify.register(import('@scalar/fastify-api-reference'), {
      configuration: {
        title: 'NAS FS Open API Specification',
        authentication: {
          preferredSecurityScheme: ['auth'],
          securitySchemes: {
            auth: {
              type: 'oauth2',
              flows: {
                authorizationCode: {
                  type: 'type',
                  'x-scalar-client-id': 'nas-fs',
                  clientSecret: 'nas-fs',
                  scopes: 'openid offline_access',
                  selectedScopes: ['openid', 'offline_access'],
                  'x-usePkce': 'SHA-256',
                },
              },
            },
          },
        },
      },
      logLevel: 'error',
      routePrefix: '/oas',
    })
  } else {
    fastify.get('/oas/json', (req) => Promise.resolve(req.server.swagger()))
    fastify.get('/oas/yaml', (req, reply) => (
      reply
        .header('content-type', 'application/yaml')
        .send(req.server.swagger({ yaml: true }))
    ))
  }
}

export default fastifyPlugin(swaggerPlugin, { name: 'swagger' })
