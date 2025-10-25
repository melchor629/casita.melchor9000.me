import { notFound, type PageLoaderContext } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import getApplication from '#queries/get-application.ts'
import Application from './application'

type ApplicationPageParams = { id: string }

type ApplicationPageProps = Readonly<{
  application: NonNullable<Awaited<ReturnType<typeof getApplication>>>
  session: ActionReturnType<'get-session'>
}>

export const loader = async (context: PageLoaderContext<ApplicationPageParams>): Promise<ApplicationPageProps> => {
  const session = await runActionForLoader('get-session', context)
  if (!session) {
    notFound()
  }

  if (!session.permissions.find((p) => p.key === 'application')) {
    notFound()
  }

  const application = await getApplication(context.nice.params.id)
  if (!application) {
    notFound()
  }

  return {
    application,
    session,
  }
}

export function metadata({ application }: ApplicationPageProps) {
  return {
    title: `${application.name} - Applications - Admin - NAS Auth`,
  }
}

const ApplicationPage = ({ application, session }: ApplicationPageProps) => {
  usePrefillGetSession(session)

  return <Application application={application} />
}

export default ApplicationPage
