import { useRevalidator } from '@melchor629/nice-ssr'
import { Button, TableCell, TableRow, TextInput } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useEditApiResource } from '#actions/mutations/edit-api-resource.ts'
import { useRemoveApiResource } from '#actions/mutations/remove-api-resource.ts'
import type { GetApplication } from '#queries/application/get-application.ts'
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
      key: apiResource.key,
      name,
      audience,
      accessTokenFormat: accessToken.format,
      jwt: accessToken.jwt,
      accessTokenTTL: accessTokenTTL ?? undefined,
      scopes,
    }, { onSuccess: () => { setEditMode(false); void revalidate() } })
  }, [
    readOnly, apiResource.key, editApiResourceMutation, revalidate,
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <TableRow>
        <TableCell>{apiResource.key}</TableCell>
        <TableCell>
          <TextInput type="text" className="mb-0" value={name} onChange={nameChanged} size="small" />
        </TableCell>
        <TableCell>
          <TextInput type="text" className="mb-0" value={audience} onChange={audienceChanged} size="small" />
        </TableCell>
        <TableCell>
          <Button
            size="small"
            onClick={() => setScopesOpened(true)}
            disabled={removeApiResourceMutation.isPending || editApiResourceMutation.isPending}
            variant="text"
          >
            Edit
          </Button>
        </TableCell>
        <TableCell>
          <Button
            size="small"
            onClick={() => setAccessTokenOpened(true)}
            disabled={removeApiResourceMutation.isPending || editApiResourceMutation.isPending}
            variant="text"
          >
            Edit
          </Button>
        </TableCell>
        <TableCell>
          <TextInput
            type="number"
            className="mb-0"
            value={accessTokenTTL}
            min={60}
            onChange={accessTokenTTLChanged}
            size="small"
          />
        </TableCell>
        <TableCell noWrap>
          <Button
            size="small"
            onClick={cancelEditMode}
            disabled={editApiResourceMutation.isPending}
            variant="text"
            color="secondary"
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            size="small"
            onClick={save}
            loading={editApiResourceMutation.isPending}
            disabled={removeApiResourceMutation.isPending}
            variant="text"
          >
            Save
          </Button>
        </TableCell>

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
    <TableRow>
      <TableCell>{apiResource.key}</TableCell>
      <TableCell>{apiResource.name}</TableCell>
      <TableCell>{apiResource.audience}</TableCell>
      <TableCell>
        {apiResource.scopes.length}
        &nbsp;scope
        {apiResource.scopes.length === 1 ? '' : 's'}
      </TableCell>
      <TableCell>{apiResource.accessTokenFormat}</TableCell>
      <TableCell>{apiResource.accessTokenTTL ?? 'default'}</TableCell>
      <TableCell noWrap>
        {!readOnly && (
          <Button size="small" onClick={activateEditMode} disabled={removeApiResourceMutation.isPending} variant="text">Edit</Button>
        )}
        &nbsp;
        {!readOnly && canDelete && (
          <Button
            size="small"
            onClick={remove}
            disabled={editApiResourceMutation.isPending}
            loading={removeApiResourceMutation.isPending}
            variant="text"
            color="error"
          >
            Delete
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default EditApplicationApiResourceRow
