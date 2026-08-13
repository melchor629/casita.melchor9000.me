import { useRevalidator } from '@melchor629/nice-ssr'
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
import type { GetApplications } from '#queries/application/get-applications.ts'
import type { GetPermissions } from '#queries/permission/get-permissions.ts'
import type { GetUserQuery } from '#queries/user/get-user.ts'

const permissionKeySelector = (p: Permission) => `${p.applicationKey}:${p.name}`
const permissionLabelSelector = (p: Permission) => `[${p.applicationKey}] ${p.displayName ?? p.name}`

type UserPermission = NonNullable<GetUserQuery['permissions']>[0]
type Permission = GetPermissions[0]
type EditUserPermissionRowProps = Readonly<{
  allApplications: GetApplications
  allPermissions: GetPermissions
  canDelete: boolean
  permission: UserPermission
  readOnly: boolean
  userName: string
}>

const EditUserPermissionRow = ({
  allApplications,
  allPermissions,
  canDelete,
  permission,
  readOnly,
  userName,
}: EditUserPermissionRowProps) => {
  const revalidator = useRevalidator()
  const editUserPermissionMutation = useEditUserPermission()
  const removeUserPermissionMutation = useRemoveUserPermission()
  const [editMode, setEditMode] = useState(false)
  const [applicationKey, setApplicationKey] = useState(permission.applicationKey)
  const [permissionObj, setPermissionObj] = useState<Permission | null | undefined>(
    () => allPermissions.find((p) => p.applicationKey === applicationKey && p.name === permission.permissionName),
  )
  const [hasWrite, setHasWrite] = useState(permission.write)
  const [hasDelete, setHasDelete] = useState(permission.delete)
  const applications = useMemo(() => (
    allApplications
      .map((app) => [app.key, app.name] as const)
  ), [allApplications])
  const permissionsForApplication = useMemo(
    () => allPermissions.filter((perm) => perm.applicationKey === applicationKey),
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

  const applicationIdChanged = useCallback((app: readonly [string, string] | null) => setApplicationKey(app ? app[0] : ''), [])
  const hasWriteChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setHasWrite(e.currentTarget.checked), [])
  const hasDeleteChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setHasDelete(e.currentTarget.checked), [])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly || !permissionObj?.name) {
      return
    }

    editUserPermissionMutation.mutate({
      permissionName: permissionObj.name,
      applicationKey: permissionObj.applicationKey,
      write: hasWrite,
      delete: hasDelete,
      userName,
    }, { onSuccess: () => { setEditMode(false); void revalidator() } })
  }, [readOnly, editUserPermissionMutation, permissionObj, revalidator, hasWrite, hasDelete, userName])

  const remove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly || !canDelete) {
      return
    }

    removeUserPermissionMutation.mutate({
      permissionName: permission.permissionName,
      applicationKey: permission.applicationKey,
      userName,
    }, { onSuccess: () => void revalidator() })
  }, [readOnly, canDelete, removeUserPermissionMutation, permission.permissionName, permission.applicationKey, userName, revalidator])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplicationKey(permission.applicationKey)
    setPermissionObj(allPermissions.find((p) => p.applicationKey === permission.applicationKey && p.name === permission.permissionName))
    setHasWrite(permission.write)
    setHasDelete(permission.delete)
  }, [allPermissions, permission])

  if (editMode) {
    return (
      <TableRow>
        <TableCell>
          <Select
            value={[applicationKey, ''] as const}
            onChange={applicationIdChanged}
            values={applications}
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
          <InputLabel input={<Checkbox id={`${permission.applicationKey}-${permission.permissionName}-write`} checked={hasWrite} onChange={hasWriteChanged} />}>
            {hasWrite ? 'Yes' : 'No'}
          </InputLabel>
        </TableCell>
        <TableCell className="select-none">
          <InputLabel input={<Checkbox id={`${permission.applicationKey}-${permission.permissionName}-delete`} checked={hasDelete} onChange={hasDeleteChanged} />}>
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
      <TableCell>{allApplications.find((a) => a.key === permission.applicationKey)?.name}</TableCell>
      <TableCell>{permission.permissionName}</TableCell>
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
