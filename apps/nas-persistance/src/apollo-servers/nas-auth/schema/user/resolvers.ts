import type { ModelResolvers } from '../schema.ts'

const userResolvers: ModelResolvers<'User'> = {
  User: {
    permissions: ({ id }, _args, { prisma }) =>
      prisma.userPermission.findMany({ where: { userId: id } }),

    logins: ({ id }, _args, { prisma }) =>
      prisma.login.findMany({ where: { userId: id } }),
  },

  Mutation: {
    addUser: (_parent, { data }, { prisma }) =>
      prisma.user.create({
        data: {
          displayName: data.displayName,
          userName: data.userName,
          disabled: data.disabled ?? undefined,
          email: data.email || undefined,
          familyName: data.familyName || undefined,
          givenName: data.givenName || undefined,
          profileImageUrl: data.profileImageUrl || undefined,
        },
      }),

    deleteUser: async (_parent, { id }, { prisma }) => {
      const { count } = await prisma.user.deleteMany({ where: { id } })
      return count > 0
    },

    updateUser: (_parent, { data, id }, { prisma }) =>
      prisma.user.update({
        data: {
          disabled: data.disabled ?? undefined,
          displayName: data.displayName || undefined,
          email: data.email || undefined,
          familyName: data.familyName || undefined,
          givenName: data.givenName || undefined,
          profileImageUrl: data.profileImageUrl || undefined,
          userName: data.userName || undefined,
        },
        where: { id },
      }),
  },

  Query: {
    user: (_parent, { displayName, emails, id, userName }, { prisma }) =>
      prisma.user.findFirst({
        where: {
          OR: [
            { displayName: displayName || undefined },
            { email: emails ? { in: emails } : undefined },
            { id: id ?? undefined },
            { userName: userName || undefined },
          ],
        },
      }),

    users: (_parent, _args, { prisma }) =>
      prisma.user.findMany({
        orderBy: { id: 'asc' },
      }),
  },
}

export default userResolvers
