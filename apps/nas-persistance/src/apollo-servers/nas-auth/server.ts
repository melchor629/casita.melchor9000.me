import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace'
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify'
import type { FastifyInstance, FastifyRequest } from 'fastify'
import { GraphQLError } from 'graphql'
import { createApolloQueryValidationPlugin } from 'graphql-constraint-directive'
import { env, nasAuthApiKeys, pathPrefix, authorities } from '../../config.ts'
import nasAuthClient from '../../orm/nas-auth/connection.ts'
import {
  ApplicationRepository,
  PermissionRepository,
  UserPermissionRepository,
  UserRepository,
} from '../../orm/nas-auth/repositories/index.ts'
import otelPlugin from '../common/plugins/otel.ts'
import type { NasAuthGraphQLContext } from './context.ts'
import { schema } from './schema/schema.ts'

const checkAuth = (req: FastifyRequest): boolean => {
  if (req.headers.authorization?.toLowerCase().startsWith('x-apikey ') && nasAuthApiKeys.find((apiKey) => req.headers.authorization?.endsWith(apiKey))) {
    return true
  }

  if (req.jwtToken) {
    return req.jwtToken.payload.aud === 'nas-persistence'
  }

  return nasAuthApiKeys.length === 0
}

const buildNasAuthServer = async (app: FastifyInstance) => {
  const logger = app.log.child({ module: 'graphql:nas-auth' })
  logger.info('Creating server...')
  const nasAuthServer = new ApolloServer<NasAuthGraphQLContext>({
    schema,
    logger,
    plugins: [
      fastifyApolloDrainPlugin(app),
      otelPlugin({ name: 'nas-auth' }),
      createApolloQueryValidationPlugin({ schema }),
    ].concat(env === 'dev' ? [ApolloServerPluginInlineTrace()] : []),
    cache: 'bounded',
  })
  await nasAuthServer.start()

  await app.register(import('@melchor629/fastify-infra/jwt'), {
    prefix: `${pathPrefix}/nas-auth`,
    oidcUrl: authorities.map((a) => new URL(a)),
  })

  await app.register(fastifyApollo(nasAuthServer), {
    path: `${pathPrefix}/nas-auth`,

    context: (request) => {
      if (!checkAuth(request)) {
        throw new GraphQLError(
          'Authorization is required to use this service',
          {
            extensions: {
              code: 'UNAUTHENTICATED',
              http: { status: 401 },
            },
          },
        )
      }

      return Promise.resolve({
        prisma: nasAuthClient,
        applicationRepository: new ApplicationRepository(nasAuthClient),
        permissionRepository: new PermissionRepository(nasAuthClient),
        userPermissionRepository: new UserPermissionRepository(nasAuthClient),
        userRepository: new UserRepository(nasAuthClient),
        openTelemetry: request.openTelemetry,
      })
    },
  })

  logger.info('Server ready')
  return nasAuthServer
}

export default buildNasAuthServer
