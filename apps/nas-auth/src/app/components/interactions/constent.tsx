import { Link } from '@melchor629/nice-ssr'
import { Fragment } from 'preact'
import { useMemo } from 'preact/hooks'
import { Button, H2 } from '../ui'
import InteractionFooter from './interaction-footer'
import type { Client, Interaction } from './types'

type ConsentProps = Readonly<{
  client: Client
  interaction: Interaction
}>

const Consent = ({ client, interaction: { details, params, uid } }: ConsentProps) => {
  const missingScopes = useMemo(() => {
    const missingOIDCScope = new Set(details.missingOIDCScope as string[])
    missingOIDCScope.delete('openid')
    missingOIDCScope.delete('offline_access')
    return Array.from(missingOIDCScope.keys())
  }, [details.missingOIDCScope])

  const missingClaims = useMemo(() => {
    const missingOIDCClaims = new Set(details.missingOIDCClaims as string[]);
    ['sub', 'sid', 'auth_time', 'acr', 'amr', 'iss'].forEach(Set.prototype.delete.bind(missingOIDCClaims))
    return Array.from(missingOIDCClaims.keys())
  }, [details.missingOIDCClaims])

  const noConsentToShow = ![
    details.missingOIDCScope as string[],
    details.missingOIDCClaims as string[],
    details.missingResourceScopes as string[],
  ].some(Boolean)
  return (
    <>
      <H2 className="mb-3">Authorize</H2>

      <ul className="list-none">
        {noConsentToShow && (
          <li>the client is asking you to confirm previously given authorization</li>
        )}
        {!!missingScopes.length && (
          <>
            <li>scopes:</li>
            <ul className="list-disc list-inside">
              {missingScopes.map((scope) => <li key={scope}>{scope}</li>)}
            </ul>
          </>
        )}
        {!!missingClaims.length && (
          <>
            <li>claims:</li>
            <ul>
              {missingClaims.map((claim) => <li key={claim}>{claim}</li>)}
            </ul>
          </>
        )}
        {details.missingResourceScopes != null && (
          Object.entries(details.missingResourceScopes as Record<string, string[]>).map(([indicator, scopes]) => (
            <Fragment key={indicator}>
              <li>
                {indicator}
                :
              </li>
              <ul>
                {scopes.map((scope) => <li key={scope}>{scope}</li>)}
              </ul>
            </Fragment>
          ))
        )}
        {Array.isArray(params.scope) && params.scope.includes('offline_access') && (
          <li>
            the client is asking to have offline access to this authorization
            {((!Array.isArray(details.missingOIDCScope)) || !details.missingOIDCScope.includes('offline_access')) && '(which you\'ve previously granted)'}
          </li>
        )}
      </ul>

      <form
        autoComplete="off"
        action={`/i/${uid}/confirm`}
        method="POST"
        className="flex justify-between mt-3 mb-4"
      >
        <Button type="submit">Continue</Button>
        <Link to={`/i/${uid}/cancel`}>
          <Button>Cancel</Button>
        </Link>
      </form>

      <InteractionFooter client={client} />
    </>
  )
}

export default Consent
