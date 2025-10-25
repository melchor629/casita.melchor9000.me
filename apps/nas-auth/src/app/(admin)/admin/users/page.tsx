import { notFound, type PageLoaderContext } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import getUsers from '#queries/get-users.ts'
import Users from './users'

type UsersPageProps = Readonly<{
  users: Awaited<ReturnType<typeof getUsers>>
  session: ActionReturnType<'get-session'>
}>

export const loader = async (context: PageLoaderContext): Promise<UsersPageProps> => {
  const session = await runActionForLoader('get-session', context)
  if (!session) {
    notFound()
  }

  if (!session.permissions.find((p) => p.key === 'user')) {
    notFound()
  }

  return {
    users: await getUsers(),
    session,
  }
}

export const metadata = {
  title: 'Users - Admin - NAS Auth',
}

const UsersPage = ({ session, users }: UsersPageProps) => {
  usePrefillGetSession(session)

  return <Users users={users} />
}

export default UsersPage
