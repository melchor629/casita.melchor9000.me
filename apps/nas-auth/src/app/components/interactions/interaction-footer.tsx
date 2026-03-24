import { memo } from 'react'
import type { Client } from './types'

const InteractionFooter = ({ client }: { readonly client: Client }) => (
  <div className="text-text-main opacity-70 text-sm text-center">
    {client.logoUri && (
      <div className="flex justify-center mb-1">
        <img src={client.logoUri} width={32} alt="client logo" className="rounded-full mb-1" />
      </div>
    )}
    You are signing in into the application&nbsp;
    {client.uri
      ? <a href={client.uri} target="_blank" rel="noopener noreferrer">{client.name}</a>
      : <em>{client.name}</em>}
    .
    {client.tosUri && <a href={client.tosUri} target="_blank" rel="noopener noreferrer">[ Terms of Service ]</a>}
    {client.policyUri && <a href={client.policyUri} target="_blank" rel="noopener noreferrer">[ Privacy Policy ]</a>}
  </div>
)

export default memo(InteractionFooter)
