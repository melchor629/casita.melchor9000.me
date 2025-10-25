import type { IncomingMessage, ServerResponse } from 'node:http'
import { redirect, type Metadata, type PageLoaderContext } from '@melchor629/nice-ssr'
import { errors } from 'oidc-provider'
import { Consent, Login } from '#components/interactions/index.ts'
import oidc from '../../../../oidc/oidc-next.ts'

type LoaderData = Readonly<{
  client: {
    name: string
    uri: string | null
    tosUri: string | null
    policyUri: string | null
    logoUri: string | null
  } | null
  interaction: {
    params: Record<string, unknown>
    uid: string
    name: string
    details: Record<string, unknown>
  } | null
  externalAuths: Array<'github' | 'google'>
}>

export const loader = async (request: PageLoaderContext): Promise<LoaderData> => {
  try {
    const h = request.headers
    const req = {
      socket: { encrypted: false },
      headers: {
        cookie: h.get('cookie'),
        'X-Forwarded-Proto': h.get('X-Forwarded-Proto'),
      },
    } as unknown as IncomingMessage
    const res = {} as ServerResponse
    const interaction = await oidc.interactionDetails(req, res)
    const clientId = interaction.params.client_id as string
    const [client, session, config] = await Promise.all([
      oidc.Client.find(clientId),
      oidc.Session.get(oidc.app.createContext(req, res)),
      import('../../../../config.ts'),
    ])

    if (interaction.prompt.name === 'login' && session.accountId) {
      const query = new URLSearchParams({ accountId: session.accountId })
      redirect(`/i/${interaction.uid}/login?${query}`)
    }

    if (client == null) {
      throw new Error(`Client ${clientId} does not exist`)
    }

    return {
      client: {
        name: client.clientName || client.clientId,
        uri: client.clientUri || null,
        tosUri: client.tosUri || null,
        policyUri: client.policyUri || null,
        logoUri: client.logoUri || null,
      },
      interaction: {
        params: interaction.params,
        uid: interaction.uid,
        name: interaction.prompt.name,
        details: interaction.prompt.details,
      },
      externalAuths: [
        config.githubClientId && config.githubClientSecret && 'github' as const,
        config.googleClientId && config.googleClientSecret && 'google' as const,
      ].filter((v): v is Exclude<NonNullable<typeof v>, ''> => !!v),
    }
  } catch (e) {
    const { SessionNotFound } = errors
    if (e instanceof SessionNotFound) {
      return {
        client: null,
        interaction: null,
        externalAuths: [],
      }
    }

    throw e
  }
}

export const metadata = ({ interaction }: LoaderData): Metadata => {
  if (!interaction) {
    return {
      title: 'Failed Sign In',
    }
  }

  return {
    title: interaction.name === 'login' ? 'Sign in' : 'Consent',
  }
}

export default function InteractionPage({ client, externalAuths, interaction }: LoaderData) {
  if (interaction === null || client === null) {
    return <div>You took too much time to act. Start again the login process...</div>
  }

  if (interaction.name === 'login') {
    return <Login client={client} interaction={interaction} externalAuths={externalAuths} />
  }

  return <Consent client={client} interaction={interaction} />
}
