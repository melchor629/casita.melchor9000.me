import { notFound, type PageLoaderContext } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import getApplications from '#queries/application/get-applications.ts'
import getPermissions from '#queries/permission/get-permissions.ts'
import getUser from '#queries/user/get-user.ts'
import User from './user'

type Params = Readonly<{ id: string }>
type UserPageProps = Readonly<{
  applications: Awaited<ReturnType<typeof getApplications>>
  user: NonNullable<Awaited<ReturnType<typeof getUser<{ userPermissions: true, logins: true, permissions: true }>>>>
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

  const user = await getUser({ userName: context.nice.params.id }, {
    userPermissions: true,
    logins: true,
    permissions: true,
  })
  if (!user) {
    notFound()
  }
  const [applications, permissions] = await Promise.all([
    getApplications(),
    getPermissions(),
  ])
  return {
    applications,
    user,
    permissions,
    session,
  }
}

export const metadata = ({ user }: UserPageProps) => ({
  title: `${user.displayName} - Users - Admin - NAS Auth`,
})

const UserPage = ({ applications, permissions, session, user }: UserPageProps) => {
  usePrefillGetSession(session)

  return <User applications={applications} permissions={permissions} user={user} />
}

export default UserPage
