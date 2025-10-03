import { Nullable, Type, type Static } from '../type-helpers.ts'

export const ApiErrorSchema = Type.Object({
  statusCode: Type.Number({
    description: 'Status code for the error',
    examples: [500],
  }),
  type: Nullable(Type.String({
    description: 'Type of error if specified',
  })),
  message: Type.String({
    description: 'Summary of the error',
  }),
  requestId: Type.String({
    description: 'Internal request id for error tracking purposes',
  }),
}, {
  title: 'ApiError',
  description: 'Any kind of error in the server or from the request',
})

export const NotFoundApiErrorSchema = Type.Interface([ApiErrorSchema], {
  statusCode: Type.Literal(404),
  type: Type.Literal('NotFound'),
  // eslint-disable-next-line no-template-curly-in-string
  message: Type.TemplateLiteral('Cannot ${string} ${string}'),
  method: Type.String({
    description: 'HTTP Method of the request',
  }),
  path: Type.String({
    description: 'HTTP Path of the request',
  }),
}, {
  title: 'NotFoundApiError',
  description: 'Kind of error when the response of the resource is not found',
})

export type ApiError = Static<typeof ApiErrorSchema>

export type NotFoundApiError = Static<typeof NotFoundApiErrorSchema>
