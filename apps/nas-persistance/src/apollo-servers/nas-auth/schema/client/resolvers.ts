import type { ModelResolvers } from '../schema.ts'

const clientResolvers: ModelResolvers<'Client'> = {
  Client: {},

  Mutation: {
    addClient: (_parent, { data }, { prisma }) =>
      prisma.client.create({
        data: {
          clientId: data.clientId,
          clientName: data.clientName,
          fields: data.fields ?? {},
        },
      }),

    deleteClient: async (_parent, { id }, { prisma }) => {
      const { count } = await prisma.client.deleteMany({ where: { clientId: id } })
      return count > 0
    },

    updateClient: (_parent, { data, id }, { prisma }) =>
      prisma.client.update({
        data: {
          clientName: data.clientName || undefined,
          fields: data.fields || undefined,
        },
        where: { clientId: id },
      }),
  },
  Query: {
    client: async (_parent, { id }, { prisma }) =>
      prisma.client.findFirst({ where: { clientId: id } }),

    clients: async (_parent, _args, { prisma }) =>
      prisma.client.findMany({ orderBy: { clientId: 'asc' } }),
  },
}

export default clientResolvers
