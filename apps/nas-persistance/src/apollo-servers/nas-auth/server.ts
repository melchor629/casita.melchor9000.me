import { ApolloServer } from '@apollo/server'
import { unwrapResolverError } from '@apollo/server/errors'
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace'
import fastifyApollo, { fastifyApolloDrainPlugin } from '@as-integrations/fastify'
import type { FastifyInstance } from 'fastify'
import { ArgumentValidationError, buildSchema } from 'type-graphql'
import { env, nasAuthApiKeys, pathPrefix } from '../../config.js'
import nasAuthDataSource from '../../orm/nas-auth/connection.js'
import {
  ApplicationRepository,
  PermissionRepository,
  UserPermissionRepository,
  UserRepository,
} from '../../orm/nas-auth/repositories/index.js'
import verifyJwt from '../../utils/jwt-plugin.js'
import otelPlugin from '../common/plugins/otel.js'
import type { NasAuthGraphQLContext } from './context.js'
import {
  ApiResourceResolver,
  ApplicationResolver,
  ClientResolver,
  LoginResolver,
  PermissionResolver,
  UserPermissionResolver,
  UserResolver,
} from './resolvers/index.js'

const buildNasAuthServer = async (app: FastifyInstance) => {
  const logger = app.log.child({ module: 'graphql:nas-auth' })
  logger.info('Building schema...')
  const nasAuthGraphqlSchema = await buildSchema({
    resolvers: [
      ApiResourceResolver,
      ApplicationResolver,
      ClientResolver,
      LoginResolver,
      PermissionResolver,
      UserResolver,
      UserPermissionResolver,
    ],
    authChecker: (ctx) => {
      const { apiKey: apiKeys, tokenUser: user } = ctx.context as NasAuthGraphQLContext
      if (apiKeys) {
        const apiKey = Array.isArray(apiKeys) ? apiKeys[0] : apiKeys
        if (nasAuthApiKeys.includes(apiKey)) {
          return true
        }
      }

      if (user) {
        return user.aud === 'nas-persistence'
      }

      return nasAuthApiKeys.length === 0
    },
  })

  logger.info('Creating server...')
  const nasAuthServer = new ApolloServer<NasAuthGraphQLContext>({
    schema: nasAuthGraphqlSchema,
    logger,
    plugins: [
      fastifyApolloDrainPlugin(app),
      otelPlugin({ name: 'nas-auth' }),
    ].concat(env === 'dev' ? [ApolloServerPluginInlineTrace()] : []),
    cache: 'bounded',
    formatError(formattedError, error) {
      const unwrappedError = unwrapResolverError(error)
      if (error instanceof ArgumentValidationError) {
        return formattedError
      }
      if (unwrappedError instanceof ArgumentValidationError) {
        return formattedError
      }

      return formattedError
    },
  })
  await nasAuthServer.start()

  await app.register(verifyJwt, {
    path: `${pathPrefix}/nas-auth`,
    optional: true,
  })

  await app.register(fastifyApollo(nasAuthServer), {
    path: `${pathPrefix}/nas-auth`,

    context: (request) => Promise.resolve({
      connection: nasAuthDataSource,
      apiKey: request.headers['x-apikey'],
      tokenUser: request.user as Record<string, string | number | boolean | null>,
      applicationRepository: new ApplicationRepository(nasAuthDataSource),
      permissionRepository: new PermissionRepository(nasAuthDataSource),
      userPermissionRepository: new UserPermissionRepository(nasAuthDataSource),
      userRepository: new UserRepository(nasAuthDataSource),
      openTelemetry: request.openTelemetry,
    }),
  })

  logger.info('Server ready')
  return nasAuthServer
}

export default buildNasAuthServer
