import nasAuthDatabase from '@melchor629/orm-nas-auth'

export type GetApplications = Array<{
  key: string
  name: string
}>

const getApplications = async (): Promise<GetApplications> => {
  const results = await nasAuthDatabase.query.application.findMany({
    columns: {
      key: true,
      name: true,
    },
    orderBy: { key: 'asc' },
  })

  return results
}

export default getApplications
