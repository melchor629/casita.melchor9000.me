import { notFound, type PageLoaderContext } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import getApiResources from '#queries/get-api-resources.ts'
import getClient from '#queries/get-client.ts'
import Client from './client'

type Params = { id: string }

type ClientPageProps = Readonly<{
  client: NonNullable<Awaited<ReturnType<typeof getClient>>>
  apiResources: Awaited<ReturnType<typeof getApiResources>>
  session: ActionReturnType<'get-session'>
}>

export const loader = async (context: PageLoaderContext<Params>): Promise<ClientPageProps> => {
  const session = await runActionForLoader('get-session', context)
  if (!session) {
    notFound()
  }

  if (!session.permissions.find((p) => p.key === 'client')) {
    notFound()
  }

  const [client, apiResources] = await Promise.all([
    getClient(context.nice.params.id),
    getApiResources(),
  ])
  if (!client) {
    notFound()
  }
  return {
    client,
    apiResources,
    session,
  }
}

export const metadata = ({ client }: ClientPageProps) => ({
  title: `${client.client_name ?? client.client_id} - Clients - Admin - NAS Auth`,
})

const ClientPage = ({ apiResources, client, session }: ClientPageProps) => {
  usePrefillGetSession(session)
  return <Client apiResources={apiResources} client={client} />
}

export default ClientPage
