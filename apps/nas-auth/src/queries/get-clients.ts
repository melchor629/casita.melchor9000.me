import nasAuthDatabase from '@melchor629/orm-nas-auth'

export type GetClients = Array<{
  clientId: string
  clientName: string
}>

const getClients = async (): Promise<GetClients> => {
  const results = await nasAuthDatabase.query.client.findMany({
    columns: {
      clientId: true,
      clientName: true,
    },
    orderBy: { clientId: 'asc' },
  })

  return results
}

export default getClients
