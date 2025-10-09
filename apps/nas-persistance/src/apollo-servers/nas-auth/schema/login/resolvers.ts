import type { ModelResolvers } from '../schema.ts'

const loginResolvers: ModelResolvers<'Login'> = {
  Login: {
    user: async ({ userId }, _args, { userRepository }) =>
      (await userRepository.get(userId))!,
  },

  Mutation: {
    addLogin: (_parent, { data }, { prisma }) =>
      prisma.login.create({
        data: {
          loginId: data.loginId,
          type: data.type,
          data: data.data || undefined,
          disabled: data.disabled ?? undefined,
          user: { connect: { id: data.userId } },
        },
      }),

    deleteLogin: async (_parent, { id }, { prisma }) => {
      const { count } = await prisma.login.deleteMany({ where: { id } })
      return count > 0
    },

    updateLogin: (_parent, { data, id }, { prisma }) =>
      prisma.login.update({
        data: {
          data: data.data || undefined,
          disabled: data.disabled || undefined,
        },
        where: { id },
      }),
  },

  Query: {
    findLogin: (_parent, { loginId, provider, userId }, { prisma }) =>
      prisma.login.findFirst({
        where: {
          type: provider,
          loginId,
          OR: userId
            ? [
                { user: { userName: userId } },
                { user: { email: userId } },
              ]
            : undefined,
        },
      }),

    login: (_parent, { id }, { prisma }) =>
      prisma.login.findUnique({ where: { id } }),
  },
}

export default loginResolvers
