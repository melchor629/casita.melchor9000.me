import type { ModelResolvers } from '../schema.ts'

const applicationResolvers: ModelResolvers<'Application'> = {
  Application: {
    apiResources: async ({ id }, _args, { prisma }) =>
      prisma.apiResource.findMany({
        where: { applicationId: id },
        orderBy: { name: 'asc' },
      }),

    permissions: async ({ id }, _args, { prisma }) =>
      prisma.permission.findMany({
        where: { applicationId: id },
        orderBy: { name: 'asc' },
      }),
  },

  Mutation: {
    addApplication: (_parent, { data }, { prisma }) =>
      prisma.application.create({
        data,
      }),

    deleteApplication: async (_parent, { key }, { prisma }) => {
      const { count } = await prisma.application.deleteMany({
        where: { key },
      })
      return count > 0
    },

    updateApplication: (_parent, { data, key }, { prisma }) =>
      prisma.application.update({
        data: {
          name: data.name || undefined,
        },
        where: { key },
      }),
  },

  Query: {
    applications: (_parent, _args, { prisma }) =>
      prisma.application.findMany({
        orderBy: { name: 'asc' },
      }),

    application: (_parent, { key }, { prisma }) =>
      prisma.application.findFirst({
        where: { key },
      }),
  },
}

export default applicationResolvers
