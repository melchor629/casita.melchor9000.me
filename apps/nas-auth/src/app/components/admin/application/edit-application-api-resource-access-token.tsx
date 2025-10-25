import type { AsymmetricSigningAlgorithm, ResourceServer, TokenFormat } from 'oidc-provider'
import type { ChangeEvent } from 'preact/compat'
import { useCallback, useEffect, useState } from 'preact/hooks'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Label,
  Select,
} from '../../ui'

const accessTokenFormats = Object.freeze(['jwt', 'opaque'] satisfies Array<TokenFormat>)
const asymmetricSigningAlgorithms = Object.freeze([
  'unset',
  'PS256',
  'PS384',
  'PS512',
  'ES256',
  'ES256K',
  'ES384',
  'ES512',
  'EdDSA',
  'RS256',
  'RS384',
  'RS512',
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
    <Dialog portal size="xl" open={opened}>
      <DialogHeader onClose={useCallback(() => close(), [close])}>
        Access Token
      </DialogHeader>
      <DialogBody>
        <Label htmlFor="at-format">Format</Label>
        &nbsp;
        <Select
          className="w-full"
          id="at-format"
          values={accessTokenFormats}
          value={state.format}
          onChange={formatChanged}
        />

        {state.format === 'jwt' && (
          <>
            <Label htmlFor="at-jwt-alg">Sign Algorithm</Label>
            <Select
              className="w-full"
              id="at-jwt-alg"
              values={asymmetricSigningAlgorithms}
              value={state.jwt?.sign?.alg as AsymmetricSigningAlgorithm ?? 'unset'}
              onChange={jwtSignAlgorithmChanged}
            />

            <Label htmlFor="at-jwt-kid">Sign Key ID</Label>
            &nbsp;
            <Input
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
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={useCallback(() => close(state), [close, state])}>
          Save
        </Button>
        &nbsp;
        <Button onClick={useCallback(() => close(), [close])}>Cancel</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default EditApplicationApiResourceAccessToken
