import nasAuthDatabase from '@melchor629/orm-nas-auth'
import clientMapper from './mapper.ts'

export type GetClient = ReturnType<typeof clientMapper.toClient>

const getClient = async (id: string): Promise<GetClient | null> => {
  const response = await nasAuthDatabase.query.client.findFirst({
    columns: {
      clientId: true,
      clientName: true,
      fields: true,
    },
    where: { clientId: id },
  })

  if (response) {
    return clientMapper.toClient(clientMapper.toDto(response))
  }

  return null
}

export default getClient
