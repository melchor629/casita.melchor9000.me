import nasAuthDatabase from '@melchor629/orm-nas-auth'

type GetApiResources = {
  key: string
  name: string
  audience: string
}

const getApiResources = async (): Promise<GetApiResources[]> => {
  const results = await nasAuthDatabase.query.apiResource.findMany({
    columns: {
      key: true,
      name: true,
      audience: true,
    },
    orderBy: { key: 'asc' },
  })

  return results
}

export default getApiResources
