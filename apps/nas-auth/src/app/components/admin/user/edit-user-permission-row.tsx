import { Button, Checkbox, InputLabel, Select, TableCell, TableRow } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useEditUserPermission } from '#actions/mutations/edit-user-permission.ts'
import { useRemoveUserPermission } from '#actions/mutations/remove-user-permission.ts'
import type { GetPermissions } from '#queries/get-permissions.ts'
import type { GetUserQuery } from '#queries/get-user.ts'

const permissionKeySelector = (p: Permission) => p.id.toString()
const permissionLabelSelector = (p: Permission) => p.name

type UserPermission = NonNullable<GetUserQuery['permissions']>[0]
type Permission = NonNullable<UserPermission['permission']>
type EditUserPermissionRowProps = Readonly<{
  allPermissions: GetPermissions
  canDelete: boolean
  permission: UserPermission
  readOnly: boolean
  userId: number
}>

const EditUserPermissionRow = ({
  allPermissions,
  canDelete,
  permission,
  readOnly,
  userId,
}: EditUserPermissionRowProps) => {
  const editUserPermissionMutation = useEditUserPermission()
  const removeUserPermissionMutation = useRemoveUserPermission()
  const [editMode, setEditMode] = useState(false)
  const [applicationKey, setApplicationKey] = useState(permission.permission?.application?.key || '')
  const [permissionObj, setPermissionObj] = useState<Permission | null | undefined>(permission.permission || null)
  const [hasWrite, setHasWrite] = useState(permission.write)
  const [hasDelete, setHasDelete] = useState(permission.delete)
  const applications = useMemo(() => Object.fromEntries(
    allPermissions
      .map((perm) => perm.application)
      .map((app) => [app.key, app.name]),
  ), [allPermissions])
  const permissionsForApplication = useMemo(
    () => allPermissions.filter((perm) => perm.application.key === applicationKey),
    [allPermissions, applicationKey],
  )

  const cancelEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(false)
  }, [])

  const activateEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(true)
  }, [])

  const applicationIdChanged = useCallback((app: [string, string] | null) => setApplicationKey(app ? app[0] : ''), [])
  const hasWriteChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setHasWrite(e.currentTarget.checked), [])
  const hasDeleteChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setHasDelete(e.currentTarget.checked), [])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly || !permissionObj?.name) {
      return
    }

    editUserPermissionMutation.mutate({
      permissionId: permissionObj.name,
      write: hasWrite,
      delete: hasDelete,
      id: permission.id,
      userId,
    }, { onSuccess: () => setEditMode(false) })
  }, [readOnly, editUserPermissionMutation, permissionObj, hasWrite, hasDelete, permission.id, userId])

  const remove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly || !canDelete) {
      return
    }

    removeUserPermissionMutation.mutate({ id: permission.id, userId })
  }, [readOnly, canDelete, removeUserPermissionMutation, permission.id, userId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplicationKey(permission.permission?.application?.key || '')
    setPermissionObj(permission.permission || null)
    setHasWrite(permission.write)
    setHasDelete(permission.delete)
  }, [permission])

  if (editMode) {
    return (
      <TableRow>
        <TableCell>
          <Select
            value={[applicationKey, '']}
            onChange={applicationIdChanged}
            values={Object.entries(applications)}
            keySelector={([k]) => k}
            labelSelector={([, v]) => v}
          />
        </TableCell>
        <TableCell>
          <Select
            value={permissionObj ?? null}
            onChange={setPermissionObj}
            values={permissionsForApplication}
            keySelector={permissionKeySelector}
            labelSelector={permissionLabelSelector}
          />
        </TableCell>
        <TableCell className="select-none">
          <InputLabel input={<Checkbox id={`${permission.id}-write`} checked={hasWrite} onChange={hasWriteChanged} />}>
            {hasWrite ? 'Yes' : 'No'}
          </InputLabel>
        </TableCell>
        <TableCell className="select-none">
          <InputLabel input={<Checkbox id={`${permission.id}-delete`} checked={hasDelete} onChange={hasDeleteChanged} />}>
            {hasDelete ? 'Yes' : 'No'}
          </InputLabel>
        </TableCell>
        <TableCell noWrap>
          <Button
            size="small"
            variant="text"
            color="secondary"
            onClick={cancelEditMode}
            disabled={editUserPermissionMutation.isPending}
            loading={removeUserPermissionMutation.isPending}
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            size="small"
            onClick={save}
            disabled={removeUserPermissionMutation.isPending}
            loading={editUserPermissionMutation.isPending}
          >
            Save
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell>{applications[permission.permission.application.key]}</TableCell>
      <TableCell>{permission.permission.name}</TableCell>
      <TableCell>{permission.write ? 'Yes' : 'No'}</TableCell>
      <TableCell>{permission.delete ? 'Yes' : 'No'}</TableCell>
      <TableCell noWrap>
        {!readOnly && (
          <Button
            size="small"
            variant="text"
            onClick={activateEditMode}
            disabled={removeUserPermissionMutation.isPending}
            loading={editUserPermissionMutation.isPending}
          >
            Edit
          </Button>
        )}
        &nbsp;
        {!readOnly && canDelete && (
          <Button
            size="small"
            variant="text"
            color="error"
            onClick={remove}
            disabled={editUserPermissionMutation.isPending}
            loading={removeUserPermissionMutation.isPending}
          >
            Delete
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default EditUserPermissionRow
