import { notFound, type PageLoaderContext } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import getApplications from '#queries/get-applications.ts'
import Applications from './applications'

type ApplicationsPageProps = Readonly<{
  applications: Awaited<ReturnType<typeof getApplications>>
  session: ActionReturnType<'get-session'>
}>

export const loader = async (context: PageLoaderContext): Promise<ApplicationsPageProps> => {
  const session = await runActionForLoader('get-session', context)
  if (!session) {
    notFound()
  }

  if (!session.permissions.find((p) => p.key === 'application')) {
    notFound()
  }

  return {
    applications: await getApplications(),
    session,
  }
}

export const metadata = {
  title: 'Applications - Admin - NAS Auth',
}

const ApplicationsPage = ({ applications, session }: ApplicationsPageProps) => {
  usePrefillGetSession(session)

  return <Applications applications={applications} />
}

export default ApplicationsPage
