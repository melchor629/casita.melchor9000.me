import fastifyPlugin from 'fastify-plugin'
import { Type, type TSchema } from 'typebox'

const isNullableSchema = (schema: TSchema): schema is TSchema & { nullable?: true } =>
  'nullable' in schema && schema.nullable === true

const isRootSchema = (schema: TSchema): schema is TSchema & { title: string, $id: string, $schema: string } =>
  'title' in schema && typeof schema.title === 'string' && !!schema.title

const isStoredSchema = (schema: TSchema): schema is TSchema & { $id: string } =>
  '$id' in schema && typeof schema.$id === 'string' && !!schema.$id

const routeProcessorPlugin = fastifyPlugin((fastify) => {
  const processSchema = (schema: TSchema, kind: string): TSchema => {
    if (isStoredSchema(schema) && fastify.getSchema(schema.$id)) {
      return Type.Ref(schema.$id)
    }

    // remove nullable mark
    if (isNullableSchema(schema)) {
      delete schema.nullable
      if ('type' in schema) {
        schema.type = [schema.type, 'null']
      }
    }

    if (Type.IsObject(schema)) {
      for (const [propKey, prop] of Object.entries(schema.properties)) {
        schema.properties[propKey] = processSchema(prop, kind)
      }
    } else if (Type.IsArray(schema)) {
      schema.items = processSchema(schema.items, kind)
    } else if (Type.IsUnion(schema)) {
      schema.anyOf = schema.anyOf.map((s) => processSchema(s, kind))
    } else if (Type.IsIntersect(schema)) {
      schema.allOf = schema.allOf.map((s) => processSchema(s, kind))
    }

    if (isRootSchema(schema)) {
      const ref = Type.Ref(`/${kind}/${schema.title}`)
      schema.$id = ref.$ref
      schema.$schema = 'http://json-schema.org/draft-07/schema#'
      if (!fastify.getSchema(ref.$ref)) {
        fastify.addSchema(schema)
      }

      return ref
    }

    return schema
  }

  fastify.addHook('onRoute', (opts) => {
    if (opts.config?.jwt) {
      const security: Record<string, string[]>[] = [{ auth: [] }]

      if (opts.config.jwt.optional) {
        security.unshift({})
      }

      opts.schema = {
        ...opts.schema,
        security,
      }
    }

    if (opts.schema) {
      opts.schema.operationId ??= opts.handler.name.replace(/controller/i, '')
      if (Type.IsSchema(opts.schema.body)) {
        opts.schema.body = processSchema(opts.schema.body, 'req')
      }
      if (Type.IsObject(opts.schema.headers)) {
        opts.schema.headers = processSchema(opts.schema.headers, 'headers')
      }
      if (Type.IsObject(opts.schema.params)) {
        opts.schema.params = processSchema(opts.schema.params, 'params')
      }
      if (Type.IsObject(opts.schema.querystring)) {
        opts.schema.querystring = processSchema(opts.schema.querystring, 'query')
      }
      if (Type.IsObject(opts.schema.response)) {
        opts.schema.response = processSchema(opts.schema.response, 'response')
      } else if (opts.schema.response && typeof opts.schema.response === 'object') {
        const response = opts.schema.response as Record<string, unknown>
        for (const [propKey, prop] of Object.entries(opts.schema.response)) {
          if (Type.IsSchema(prop)) {
            response[propKey] = processSchema(prop, 'response')
          }
        }
      }
    }
  })

  return Promise.resolve()
})

export default routeProcessorPlugin
