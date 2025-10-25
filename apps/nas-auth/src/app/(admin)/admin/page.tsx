import { notFound, type PageLoaderContext } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import AdminHome from './admin-home'

type AdminHomeProps = Readonly<{
  session: ActionReturnType<'get-session'>
}>

export const loader = async (context: PageLoaderContext): Promise<AdminHomeProps> => {
  const session = await runActionForLoader('get-session', context)
  if (!session) {
    notFound()
  }

  return { session }
}

export const metadata = {
  title: 'Admin - NAS Auth',
}

const AdminHomePage = ({ session }: AdminHomeProps) => {
  usePrefillGetSession(session)

  return <AdminHome />
}

export default AdminHomePage
