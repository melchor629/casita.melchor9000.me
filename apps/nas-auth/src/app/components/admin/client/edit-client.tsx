import type {
  AsymmetricSigningAlgorithm,
  ClientAuthMethod,
  ClientMetadata,
  ResponseType,
  SigningAlgorithmWithNone,
  SymmetricSigningAlgorithm,
} from 'oidc-provider'
import type { ChangeEvent, MouseEvent } from 'preact/compat'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks'
import { useEditClient } from '../../../actions/mutations/edit-client'
import { useRemoveClient } from '../../../actions/mutations/remove-client'
import {
  Button,
  CheckboxList,
  Input,
  Label,
  Select,
} from '../../ui'
import EditUrls from './edit-urls'

const grantTypes = ['implicit', 'authorization_code', 'client_credentials'] as const
const responseTypes = Object.freeze([
  'code',
  'id_token',
  'code id_token',
  'id_token token',
  'code token',
  'code id_token token',
  'none',
] as ResponseType[])
const clientAuthMethod = Object.freeze([
  '',
  'client_secret_basic',
  'client_secret_post',
  'client_secret_jwt',
  'private_key_jwt',
  'tls_client_auth',
  'self_signed_tls_client_auth',
  'none',
] as Array<ClientAuthMethod | ''>)
const asymmetricSigningAlgorithm = Object.freeze([
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
] as AsymmetricSigningAlgorithm[])
const symmetricSigningAlgorithm = Object.freeze([
  'HS256',
  'HS384',
  'HS512',
] as SymmetricSigningAlgorithm[])
const signingAlgorithmWithNone = Object.freeze([
  '',
  'none',
  ...asymmetricSigningAlgorithm,
  ...symmetricSigningAlgorithm,
] as Array<SigningAlgorithmWithNone | ''>)

const corsProp = 'urn:custom:client:allowed-cors-origins'
// const allowedApiResourcesProp = 'urn:custom:client:allowed-api-resources'
const defaultApiResourcesProp = 'urn:custom:client:default-api-resources'
const setPkceOptionalProp = 'urn:custom:client:set-pkce-optional'

const apiResourceKeySelector = ({ key }: ApiResource) => key
const apiResourceLabelSelector = ({ audience, name }: ApiResource) => (audience ? `${name} (${audience})` : name)

type ApiResource = { audience?: string, key: string, name: string }
type EditClientProps = Readonly<{
  apiResources: ReadonlyArray<ApiResource>
  canDelete: boolean
  client: ClientMetadata
  readOnly: boolean
}>

const EditClient = ({ apiResources, canDelete, client: c, readOnly }: EditClientProps) => {
  const editClientMutation = useEditClient()
  const removeClientMutation = useRemoveClient()
  const [client, setClient] = useState(c)

  const genericOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const key = e.currentTarget.name as Exclude<keyof ClientMetadata, 'client_id'>
    setClient((c) => ({ ...c, [key]: e.currentTarget.value || undefined }))
  }, [])

  const grantTypesChanged = useCallback((newValue: string[]) => {
    setClient((c) => ({ ...c, grant_types: newValue }))
  }, [])

  const responseTypesChanged = useCallback((newValue: ResponseType[]) => {
    setClient((c) => ({ ...c, response_types: newValue }))
  }, [])

  const tokenEndpointAuthMethodChanged = useCallback((newValue: ClientAuthMethod | '' | null) => {
    setClient((c) => ({ ...c, token_endpoint_auth_method: newValue || undefined }))
  }, [])

  const idTokenSignedResponseAlgChanged = useCallback((newValue: SigningAlgorithmWithNone | '' | null) => {
    setClient((c) => ({ ...c, id_token_signed_response_alg: newValue || undefined }))
  }, [])

  const defaultApiResourceChanged = useCallback((apiResource: ApiResource | null) => {
    setClient((c) => ({ ...c, [defaultApiResourcesProp]: apiResource?.key || undefined }))
  }, [])

  const setPkceDisabledChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setClient((c) => ({ ...c, [setPkceOptionalProp]: e.currentTarget.checked }))
  }, [])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (readOnly) {
      return
    }

    const { client_id: clientId, client_name: clientName, ...fields } = client
    editClientMutation.mutate({
      clientId,
      clientName: clientName!,
      ...fields,
    })
  }, [readOnly, client, editClientMutation])

  const remove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (readOnly || !canDelete) {
      return
    }

    removeClientMutation.mutate(client.client_id)
  }, [readOnly, canDelete, removeClientMutation, client.client_id])

  useEffect(() => {
    setClient(c)
  }, [c])

  return (
    <fieldset className="my-2" disabled={readOnly || editClientMutation.isPending}>
      <Label htmlFor="client-id">Client ID</Label>
      <Input
        type="text"
        id="client-id"
        value={client.client_id}
        readOnly
      />

      <Label htmlFor="client-name">Client Name</Label>
      <Input
        type="text"
        id="client-name"
        name="client_name"
        value={client.client_name || ''}
        onChange={genericOnChange}
        readOnly={readOnly}
      />

      <Label htmlFor="app-uri">Application URI</Label>
      <Input
        type="url"
        id="app-uri"
        name="client_uri"
        value={client.client_uri || ''}
        onChange={genericOnChange}
        readOnly={readOnly}
      />

      <Label htmlFor="tos-uri">Terms Of Service URI</Label>
      <Input
        type="url"
        id="tos-uri"
        name="tos_uri"
        value={client.tos_uri || ''}
        onChange={genericOnChange}
        readOnly={readOnly}
      />

      <Label htmlFor="policy-uri">Privacy Policy URI</Label>
      <Input
        type="url"
        id="policy-uri"
        name="policy_uri"
        value={client.policy_uri || ''}
        onChange={genericOnChange}
        readOnly={readOnly}
      />

      <Label htmlFor="logo-uri">Logo URI</Label>
      <Input
        type="url"
        id="logo-uri"
        name="logo_uri"
        value={client.logo_uri || ''}
        onChange={genericOnChange}
        readOnly={readOnly}
      />

      <div className="my-6" />

      <div>Grant Types</div>
      <CheckboxList
        selected={client.grant_types || []}
        onChange={grantTypesChanged}
        options={grantTypes}
      />

      <div>Response Types</div>
      <CheckboxList
        selected={client.response_types || []}
        onChange={responseTypesChanged}
        options={responseTypes}
      />

      <Label htmlFor="token-endpoint-auth-method">Token Endpoint Auth Method</Label>
      <Select
        className="block w-full"
        id="token-endpoint-auth-method"
        name="token_endpoint_auth_method"
        onChange={tokenEndpointAuthMethodChanged}
        value={client.token_endpoint_auth_method || ''}
        values={clientAuthMethod}
      />

      {(
        client.token_endpoint_auth_method === 'client_secret_basic'
          || client.token_endpoint_auth_method === 'client_secret_post'
      )
        ? (
          <>
            <Label htmlFor="client-secret">Client Secret</Label>
            <Input
              type="text"
              id="client-secret"
              name="client_secret"
              value={client.client_secret || ''}
              onChange={genericOnChange}
              readOnly={readOnly}
            />
          </>
          )
        : client.token_endpoint_auth_method && (
          <div>{`Not implemented ${client.token_endpoint_auth_method}`}</div>
        )}

      <Label htmlFor="id-token-signed-response-alg">ID Token Signed Response Algorithm</Label>
      <Select
        className="block w-full"
        id="id-token-signed-response-alg"
        name="id_token_signed_response_alg"
        onChange={idTokenSignedResponseAlgChanged}
        value={client.id_token_signed_response_alg || ''}
        values={signingAlgorithmWithNone}
      />

      <Label htmlFor="set-pkce-optional">
        <Input
          type="checkbox"
          id="set-pkce-optional"
          name="set-pkce-optional"
          checked={client[setPkceOptionalProp] as boolean ?? false}
          onChange={setPkceDisabledChanged}
        />
        &nbsp;
        Set PKCE optional?
      </Label>

      <div className="my-6" />

      <Label htmlFor="redirect_uris">Redirect URIs</Label>
      <EditUrls client={client} setClient={setClient} field="redirect_uris" />

      <Label htmlFor="post_logout_redirect_uris">Post Logout Redirect URIs</Label>
      <EditUrls client={client} setClient={setClient} field="post_logout_redirect_uris" />

      <Label htmlFor={corsProp}>CORS Origins</Label>
      <EditUrls client={client} setClient={setClient} field={corsProp} />

      <Label htmlFor="default-api-resource">Default API Resource</Label>
      <Select
        className="block w-full"
        id="default-api-resource"
        name={defaultApiResourcesProp}
        onChange={defaultApiResourceChanged}
        value={{ key: client[defaultApiResourcesProp] as string || '', name: '' }}
        values={useMemo(() => [{ key: '', name: 'Not Selected' }, ...apiResources], [apiResources])}
        keySelector={apiResourceKeySelector}
        labelSelector={apiResourceLabelSelector}
      />

      <div className="flex justify-end gap-2 mt-4">
        {!readOnly && (
          <Button
            type="button"
            loading={editClientMutation.isPending}
            disabled={removeClientMutation.isPending}
            onClick={save}
          >
            Save
          </Button>
        )}
        {!readOnly && canDelete && (
          <Button
            type="button"
            loading={removeClientMutation.isPending}
            disabled={editClientMutation.isPending}
            onClick={remove}
          >
            Delete
          </Button>
        )}
      </div>
    </fieldset>
  )
}

export default EditClient
