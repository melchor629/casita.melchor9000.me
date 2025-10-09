import type { ModelResolvers } from '../schema.ts'

const permissionResolvers: ModelResolvers<'Permission'> = {
  Permission: {
    application: async ({ applicationId }, _args, { applicationRepository }) =>
      (await applicationRepository.get(applicationId))!,
  },

  Mutation: {
    addPermission: (_parent, { data }, { prisma }) =>
      prisma.permission.create({
        data: {
          name: data.name,
          application: { connect: { key: data.applicationKey } },
          displayName: data.displayName || undefined,
        },
      }),

    deletePermission: async (_parent, { id }, { prisma }) => {
      const { count } = await prisma.permission.deleteMany({ where: { id } })
      return count > 0
    },

    updatePermission: async (_parent, { data, id }, { prisma }) =>
      prisma.permission.update({
        data: {
          name: data.name || undefined,
          displayName: data.displayName || undefined,
        },
        where: { id },
      }),
  },

  Query: {
    permissions: (_parent, _args, { prisma }) =>
      prisma.permission.findMany({
        orderBy: [
          { name: 'asc' },
          { application: { key: 'asc' } },
        ],
        include: { application: { select: { key: true } } },
      }),
  },
}

export default permissionResolvers
