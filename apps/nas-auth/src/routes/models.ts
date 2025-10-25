import type {
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

type ControllerOptions<Route extends GenericRoute> = RouteShorthandOptions<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  Route
>

type ControllerHandler<Route extends GenericRoute> = RouteHandlerMethod<
  RawServerDefault,
  RawRequestDefaultExpression<RawServerDefault>,
  RawReplyDefaultExpression<RawServerDefault>,
  Route
>

/**
 * Controller definition
 * @internal
 */
export type Controller<Route extends GenericRoute = GenericRoute> = ControllerHandler<Route> & {
  options: ControllerOptions<Route>
}
