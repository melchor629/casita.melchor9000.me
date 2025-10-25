// eslint-disable-next-line import-x/no-extraneous-dependencies
import { makeExecutableSchema } from '@graphql-tools/schema'
import { constraintDirectiveTypeDefs } from 'graphql-constraint-directive'
import apiResourceResolvers from './api-resource/resolvers.ts'
import applicationResolvers from './application/resolvers.ts'
import baseResolvers from './base/resolvers.ts'
import clientResolvers from './client/resolvers.ts'
import loginResolvers from './login/resolvers.ts'
import permissionResolvers from './permission/resolvers.ts'
import { typeDefs } from './type-defs.generated.ts'
import type { Resolvers } from './types.generated.ts'
import userResolvers from './user/resolvers.ts'
import userPermissionResolvers from './user-permission/resolvers.ts'

export type ModelResolvers<T extends Exclude<keyof Resolvers, 'Query' | 'Mutation'>> = {
  [K in T]-?: NonNullable<Resolvers[K]>
} & {
  Query: {
    [K in keyof NonNullable<Resolvers['Query']> as Uppercase<K> extends `${string}${Uppercase<T>}${string}` ? K : never]-?: NonNullable<Resolvers['Query']>[K]
  }
  Mutation: {
    [K in keyof NonNullable<Resolvers['Mutation']> as K extends `${'add' | 'delete' | 'update'}${T}` ? K : never]-?: NonNullable<NonNullable<Resolvers['Mutation']>[K]>
  }
}

const modelResolvers: Resolvers[] = [
  apiResourceResolvers,
  applicationResolvers,
  clientResolvers,
  loginResolvers,
  permissionResolvers,
  userResolvers,
  userPermissionResolvers,
]

export const schema = makeExecutableSchema({
  typeDefs: [
    constraintDirectiveTypeDefs,
    typeDefs,
  ],
  resolvers: Object.freeze({
    ...baseResolvers,

    ...(modelResolvers.reduce((a, r) => ({
      ...a,
      ...r,
      Query: { ...a.Query, ...r.Query },
      Mutation: { ...a.Mutation, ...r.Mutation },
    }), { Query: {}, Mutation: {} })),
  }),
})
