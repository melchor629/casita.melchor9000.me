import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import type {
  ContextConfigDefault,
  FastifySchema,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteGenericInterface,
  RouteHandlerMethod,
  RouteShorthandOptions,
} from 'fastify'

/**
 * Route definition for a controller
 * @internal
 */
export type GenericRoute = RouteGenericInterface

type ControllerOptions<TSchema extends FastifySchema> = RouteShorthandOptions<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  RouteGenericInterface,
  ContextConfigDefault,
  TSchema,
  TypeBoxTypeProvider
>

type ControllerHandler<TSchema extends FastifySchema> = RouteHandlerMethod<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  RouteGenericInterface,
  ContextConfigDefault,
  TSchema,
  TypeBoxTypeProvider
>

/**
 * Controller definition
 * @internal
 */
export type Controller<TSchema extends FastifySchema = FastifySchema> = ControllerHandler<TSchema> & {
  options: ControllerOptions<TSchema>
}

export {
  Type,
  DateTime,
  Nullable,
  StringEnum,
  Binary,
  ContentResponse,
} from './type-helpers.ts'
