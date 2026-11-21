import { memo } from 'react'
import type { Client } from './types'

const InteractionFooter = ({ client }: { readonly client: Client }) => (
  <div className="text-text-main text-center text-sm opacity-70">
    {client.logoUri && (
      <div className="mb-1 flex justify-center">
        <img
          src={client.logoUri}
          width={32}
          alt="client logo"
          className="mb-1 rounded-full"
        />
      </div>
    )}
    You are signing in into the application&nbsp;
    {client.uri ? (
      <a
        href={client.uri}
        target="_blank"
        rel="noopener noreferrer"
      >
        {client.name}
      </a>
    ) : (
      <em>{client.name}</em>
    )}
    .
    {client.tosUri && (
      <a
        href={client.tosUri}
        target="_blank"
        rel="noopener noreferrer"
      >
        [ Terms of Service ]
      </a>
    )}
    {client.policyUri && (
      <a
        href={client.policyUri}
        target="_blank"
        rel="noopener noreferrer"
      >
        [ Privacy Policy ]
      </a>
    )}
  </div>
)

export default memo(InteractionFooter)
