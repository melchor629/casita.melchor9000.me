import { notFound, type PageLoaderContext } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import getPermissions from '#queries/get-permissions.ts'
import getUser from '#queries/get-user.ts'
import User from './user'

type Params = Readonly<{ id: string }>
type UserPageProps = Readonly<{
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>
  permissions: Awaited<ReturnType<typeof getPermissions>>
  session: ActionReturnType<'get-session'>
}>

export const loader = async (context: PageLoaderContext<Params>): Promise<UserPageProps> => {
  const session = await runActionForLoader('get-session', context)
  if (!session) {
    notFound()
  }

  if (!session.permissions.find((p) => p.key === 'user')) {
    notFound()
  }

  const user = await getUser({ id: parseInt(context.nice.params.id, 10) }, {
    userPermissions: true,
    logins: true,
    permissions: true,
  })
  if (!user) {
    notFound()
  }
  return {
    user,
    permissions: await getPermissions(),
    session,
  }
}

export const metadata = ({ user }: UserPageProps) => ({
  title: `${user.displayName} - Users - Admin - NAS Auth`,
})

const UserPage = ({ permissions, session, user }: UserPageProps) => {
  usePrefillGetSession(session)

  return <User permissions={permissions} user={user} />
}

export default UserPage
