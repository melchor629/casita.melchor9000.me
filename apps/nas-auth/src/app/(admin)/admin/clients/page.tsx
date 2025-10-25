import { notFound, type PageLoaderContext } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import getClients from '#queries/get-clients.ts'
import Clients from './clients'

type ClientsPageProps = Readonly<{
  clients: Awaited<ReturnType<typeof getClients>>
  session: ActionReturnType<'get-session'>
}>

export const loader = async (context: PageLoaderContext): Promise<ClientsPageProps> => {
  const session = await runActionForLoader('get-session', context)
  if (!session) {
    notFound()
  }

  if (!session.permissions.find((p) => p.key === 'client')) {
    notFound()
  }

  return {
    clients: await getClients(),
    session,
  }
}

export const metadata = {
  title: 'Clients - Admin - NAS Auth',
}

const ClientsPage = ({ clients, session }: ClientsPageProps) => {
  usePrefillGetSession(session)

  return <Clients clients={clients} />
}

export default ClientsPage
