import { JSONObjectResolver, JSONResolver } from 'graphql-scalars'
import type { Resolvers } from '../types.generated.ts'

const baseResolvers: Resolvers = {
  JSON: JSONResolver,
  JSONObject: JSONObjectResolver,
}

export default baseResolvers
