import nasAuthDatabase from '@melchor629/orm-nas-auth'

export type GetUsers = Array<{
  id: number
  userName: string
  displayName: string
  givenName?: string | null | undefined
  familyName?: string | null | undefined
  email?: string | null | undefined
  profileImageUrl?: string | null | undefined
}>

const getUsers = async (): Promise<GetUsers> => {
  const results = await nasAuthDatabase.query.user.findMany({
    orderBy: { userName: 'asc' },
  })

  return results
}

export default getUsers
