import type { ModelResolvers } from '../schema.ts'

const userPermissionResolvers: ModelResolvers<'UserPermission'> = {
  UserPermission: {
    permission: async ({ permissionId }, _args, { permissionRepository }) =>
      (await permissionRepository.get(permissionId))!,

    user: async ({ userId }, _args, { userRepository }) =>
      (await userRepository.get(userId))!,
  },

  Mutation: {
    addUserPermission: (_parent, { data }, { prisma }) =>
      prisma.userPermission.create({
        data: {
          delete: data.delete,
          permission: { connect: { id: data.permissionId } },
          user: { connect: { id: data.userId } },
          write: data.write,
        },
      }),

    deleteUserPermission: async (_parent, { id }, { prisma }) => {
      const { count } = await prisma.userPermission.deleteMany({
        where: { id },
      })
      return count > 0
    },

    updateUserPermission: (_parent, { data, id }, { prisma }) =>
      prisma.userPermission.update({
        data: {
          delete: data.delete,
          write: data.write,
        },
        where: { id },
      }),
  },
  Query: {},
}

export default userPermissionResolvers
