import { Button, Dialog, FormControlLabel, Select, TextInput } from '@melchor629/ui'
import type { AsymmetricSigningAlgorithm, ResourceServer, TokenFormat } from 'oidc-provider'
import type { ChangeEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'

const accessTokenFormats = Object.freeze(['jwt', 'opaque'] satisfies Array<TokenFormat>)
const asymmetricSigningAlgorithms = Object.freeze([
  'unset',
  'PS256',
  'PS384',
  'PS512',
  'ES256',
  'ES384',
  'ES512',
  'EdDSA',
  'RS256',
  'RS384',
  'RS512',
  'ML-DSA-44',
  'ML-DSA-65',
  'ML-DSA-87',
] satisfies Array<AsymmetricSigningAlgorithm | 'unset'>)

type EditApplicationApiResourceAccessTokenProps = Readonly<{
  accessToken: Readonly<{
    format: NonNullable<ResourceServer['accessTokenFormat']>
    jwt: ResourceServer['jwt']
  }>
  close: (accessToken?: EditApplicationApiResourceAccessTokenProps['accessToken']) => void
  opened: boolean
}>

const EditApplicationApiResourceAccessToken = ({ accessToken, close, opened }: EditApplicationApiResourceAccessTokenProps) => {
  const [state, setState] = useState(accessToken)

  const formatChanged = useCallback((format: TokenFormat | null) => {
    setState((s) => ({
      ...s,
      format: format ?? 'jwt',
    }))
  }, [])

  const jwtSignAlgorithmChanged = useCallback((value: AsymmetricSigningAlgorithm | 'unset' | null) => setState((s) => ({
    ...s,
    jwt: {
      ...s.jwt,
      sign: {
        ...s.jwt?.sign,
        alg: value === 'unset' ? undefined : (value || undefined),
      },
    },
  })), [])

  const jwtSignKidChanged = useCallback(({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => setState((s) => ({
    ...s,
    jwt: {
      ...s.jwt,
      sign: {
        ...s.jwt?.sign,
        kid: value || undefined,
      },
    },
  })), [])

  useEffect(() => {
    setState(accessToken)
  }, [accessToken])

  return (
    <Dialog
      id="edit-application-api-resource-access-token"
      show={opened}
      portal
      size="extra-large"
      onClose={useCallback(() => close(), [close])}
      title="Access Token"
      buttons={[
        <Button key="save" onClick={useCallback(() => close(state), [close, state])}>
          Save
        </Button>,
      ]}
    >
      <FormControlLabel htmlFor="at-format">Format</FormControlLabel>
      <Select
        fullWidth
        id="at-format"
        values={accessTokenFormats}
        value={state.format}
        onChange={formatChanged}
      />

      {state.format === 'jwt' && (
        <>
          <FormControlLabel htmlFor="at-jwt-alg" margin="normal">Sign Algorithm</FormControlLabel>
          <Select
            fullWidth
            id="at-jwt-alg"
            values={asymmetricSigningAlgorithms}
            value={state.jwt?.sign?.alg as AsymmetricSigningAlgorithm ?? 'unset'}
            onChange={jwtSignAlgorithmChanged}
          />

          <FormControlLabel htmlFor="at-jwt-kid" margin="normal">Sign Key ID</FormControlLabel>
          <TextInput
            type="text"
            id="at-jwt-kid"
            value={state.jwt?.sign?.kid ?? ''}
            onChange={jwtSignKidChanged}
          />
        </>
      )}

      {state.format === 'opaque' && (
        <div>
          opaque format does not have options
        </div>
      )}
    </Dialog>
  )
}

export default EditApplicationApiResourceAccessToken
