import type { ModelResolvers } from '../schema.ts'

const apiResourceResolvers: ModelResolvers<'ApiResource'> = {
  ApiResource: {
    jwt: ({ jwt }) => jwt as Record<string, string>,
    application: async (apiResource, _args, { applicationRepository }) =>
      (await applicationRepository.get(apiResource.applicationId))!,
  },

  Mutation: {
    addApiResource: async (_parent, { data: { applicationKey, ...data } }, { prisma }) =>
      prisma.apiResource.create({
        data: {
          ...data,
          scopes: Array.isArray(data.scopes) ? data.scopes as string[] : [],
          jwt: typeof data.jwt === 'object' ? data.jwt! as Record<string, string> : undefined,
          application: { connect: { key: applicationKey } },
        },
      }),

    deleteApiResource: async (_parent, { key }, { prisma }) => {
      const { count } = await prisma.apiResource.deleteMany({ where: { key } })
      return count > 0
    },

    updateApiResource: async (_parent, { data, key }, { prisma }) => {
      const apiResource = await prisma.apiResource.update({
        data: {
          accessTokenFormat: data.accessTokenFormat || undefined,
          accessTokenTTL: data.accessTokenTTL,
          audience: data.audience || undefined,
          jwt: typeof data.jwt === 'object' ? data.jwt! as Record<string, string> : undefined,
          name: data.name || undefined,
          scopes: Array.isArray(data.scopes) ? data.scopes as string[] : undefined,
        },
        where: { key },
      })
      return apiResource
    },
  },
  Query: {
    apiResources: (_parent, _args, { prisma }) =>
      prisma.apiResource.findMany({
        orderBy: { key: 'asc' },
      }),

    apiResource: async (_parent, { key }, { prisma }) => {
      const apiResource = await prisma.apiResource.findFirst({
        where: { key },
      })
      return apiResource
    },
  },
}

export default apiResourceResolvers
