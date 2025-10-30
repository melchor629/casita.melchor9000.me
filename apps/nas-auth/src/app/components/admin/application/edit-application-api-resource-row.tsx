import { useRevalidator } from '@melchor629/nice-ssr'
import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { useEditApiResource } from '#actions/mutations/edit-api-resource.ts'
import { useRemoveApiResource } from '#actions/mutations/remove-api-resource.ts'
import type { GetApplication } from '#queries/get-application.ts'
import {
  Button,
  Input,
  TableColumn,
  TableRow,
} from '../../ui'
import EditApplicationApiResourceAccessToken from './edit-application-api-resource-access-token'
import EditApplicationApiResourceScopes from './edit-application-api-resource-scopes'

type EditApplicationApiResourceRowProps = Readonly<{
  apiResource: GetApplication['apiResources'][0]
  appId: string
  canDelete: boolean
  readOnly: boolean
}>

const EditApplicationApiResourceRow = ({
  apiResource,
  appId,
  canDelete,
  readOnly,
}: EditApplicationApiResourceRowProps) => {
  const editApiResourceMutation = useEditApiResource()
  const removeApiResourceMutation = useRemoveApiResource()
  const revalidate = useRevalidator()
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState(apiResource.name)
  const [audience, setAudience] = useState(apiResource.audience || '')
  const [accessToken, setAccessToken] = useState(() => ({
    format: apiResource.accessTokenFormat || 'jwt',
    jwt: apiResource.jwt,
  }))
  const [accessTokenTTL, setAccessTokenTTL] = useState(apiResource.accessTokenTTL ?? 3600)
  const [scopes, setScopes] = useState(apiResource.scopes)
  const [accessTokenOpened, setAccessTokenOpened] = useState(false)
  const [scopesOpened, setScopesOpened] = useState(false)

  const cancelEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(false)
    setAccessTokenOpened(false)
    setScopesOpened(false)
  }, [])

  const activateEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(true)
    setAccessTokenOpened(false)
    setScopesOpened(false)
  }, [])

  const nameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value), [])
  const audienceChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setAudience(e.currentTarget.value), [])
  const accessTokenTTLChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setAccessTokenTTL(e.currentTarget.valueAsNumber), [])

  const onAccessTokenDialogClose = useCallback((data?: typeof accessToken) => {
    if (data) {
      setAccessToken(data)
    }

    setAccessTokenOpened(false)
  }, [])

  const onScopesDialogClose = useCallback((data?: readonly string[]) => {
    if (data) {
      setScopes([...data])
    }

    setScopesOpened(false)
  }, [])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly) {
      return
    }

    editApiResourceMutation.mutate({
      appId,
      key: apiResource.key,
      name,
      audience,
      accessTokenFormat: accessToken.format,
      jwt: accessToken.jwt,
      accessTokenTTL: accessTokenTTL ?? undefined,
      scopes,
    }, { onSuccess: () => { setEditMode(false); void revalidate() } })
  }, [
    readOnly, appId, apiResource.key, editApiResourceMutation, revalidate,
    name, audience, accessToken, accessTokenTTL, scopes,
  ])

  const remove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly || !canDelete) {
      return
    }

    removeApiResourceMutation.mutate({
      appId,
      key: apiResource.key,
    }, { onSuccess: () => void revalidate() })
  }, [readOnly, canDelete, removeApiResourceMutation, appId, apiResource.key, revalidate])

  useEffect(() => {
    setName(apiResource.name)
    setAudience(apiResource.audience || '')
    setAccessToken({
      format: apiResource.accessTokenFormat || 'jwt',
      jwt: apiResource.jwt,
    })
    setAccessTokenTTL(apiResource.accessTokenTTL ?? 3600)
    setScopes(apiResource.scopes)
  }, [apiResource])

  if (editMode) {
    return (
      <TableRow hover>
        <TableColumn>{apiResource.key}</TableColumn>
        <TableColumn>
          <Input type="text" className="mb-0" value={name} onChange={nameChanged} />
        </TableColumn>
        <TableColumn>
          <Input type="text" className="mb-0" value={audience} onChange={audienceChanged} />
        </TableColumn>
        <TableColumn>
          <Button
            size="sm"
            onClick={() => setScopesOpened(true)}
            disabled={removeApiResourceMutation.isPending || editApiResourceMutation.isPending}
          >
            Edit
          </Button>
        </TableColumn>
        <TableColumn>
          <Button
            size="sm"
            onClick={() => setAccessTokenOpened(true)}
            disabled={removeApiResourceMutation.isPending || editApiResourceMutation.isPending}
          >
            Edit
          </Button>
        </TableColumn>
        <TableColumn>
          <Input
            type="number"
            className="mb-0"
            value={accessTokenTTL}
            min={60}
            onChange={accessTokenTTLChanged}
          />
        </TableColumn>
        <TableColumn>
          <Button
            size="sm"
            onClick={cancelEditMode}
            disabled={editApiResourceMutation.isPending}
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            size="sm"
            onClick={save}
            loading={editApiResourceMutation.isPending}
            disabled={removeApiResourceMutation.isPending}
          >
            Save
          </Button>
        </TableColumn>

        <EditApplicationApiResourceAccessToken
          accessToken={accessToken}
          close={onAccessTokenDialogClose}
          opened={accessTokenOpened}
        />

        <EditApplicationApiResourceScopes
          scopes={scopes}
          close={onScopesDialogClose}
          opened={scopesOpened}
        />
      </TableRow>
    )
  }

  return (
    <TableRow hover>
      <TableColumn>{apiResource.key}</TableColumn>
      <TableColumn>{apiResource.name}</TableColumn>
      <TableColumn>{apiResource.audience}</TableColumn>
      <TableColumn>
        {apiResource.scopes.length}
        &nbsp;scope
        {apiResource.scopes.length === 1 ? '' : 's'}
      </TableColumn>
      <TableColumn>{apiResource.accessTokenFormat}</TableColumn>
      <TableColumn>{apiResource.accessTokenTTL ?? 'default'}</TableColumn>
      <TableColumn>
        {!readOnly && (
          <Button size="sm" onClick={activateEditMode} disabled={removeApiResourceMutation.isPending}>Edit</Button>
        )}
        &nbsp;
        {!readOnly && canDelete && (
          <Button
            size="sm"
            onClick={remove}
            disabled={editApiResourceMutation.isPending}
            loading={removeApiResourceMutation.isPending}
          >
            Delete
          </Button>
        )}
      </TableColumn>
    </TableRow>
  )
}

export default EditApplicationApiResourceRow
