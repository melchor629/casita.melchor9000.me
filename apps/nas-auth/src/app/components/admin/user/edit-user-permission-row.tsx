import type { ChangeEvent, MouseEvent } from 'preact/compat'
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks'
import { useEditUserPermission } from '../../../actions/mutations/edit-user-permission'
import { useRemoveUserPermission } from '../../../actions/mutations/remove-user-permission'
import type { GetPermissions } from '../../../../queries/get-permissions'
import type { GetUserQuery } from '../../../../queries/get-user'
import {
  Button,
  Input,
  Label,
  Select,
  TableColumn,
  TableRow,
} from '../../ui'

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
  }, [readOnly, editUserPermissionMutation, permissionObj?.name, hasWrite, hasDelete, permission.id, userId])

  const remove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly || !canDelete) {
      return
    }

    removeUserPermissionMutation.mutate({ id: permission.id, userId })
  }, [readOnly, canDelete, removeUserPermissionMutation, permission.id, userId])

  useEffect(() => {
    setApplicationKey(permission.permission?.application?.key || '')
    setPermissionObj(permission.permission || null)
    setHasWrite(permission.write)
    setHasDelete(permission.delete)
  }, [permission])

  if (editMode) {
    return (
      <TableRow hover>
        <TableColumn>
          <Select
            value={[applicationKey, '']}
            onChange={applicationIdChanged}
            values={Object.entries(applications)}
            keySelector={([k]) => k}
            labelSelector={([, v]) => v}
          />
        </TableColumn>
        <TableColumn>
          <Select
            value={permissionObj ?? null}
            onChange={setPermissionObj}
            values={permissionsForApplication}
            keySelector={permissionKeySelector}
            labelSelector={permissionLabelSelector}
          />
        </TableColumn>
        <TableColumn className="select-none">
          <Input type="checkbox" id={`${permission.id}-write`} checked={hasWrite} onChange={hasWriteChanged} />
          &nbsp;
          <Label htmlFor={`${permission.id}-write`}>{hasWrite ? 'Yes' : 'No'}</Label>
        </TableColumn>
        <TableColumn className="select-none">
          <Input type="checkbox" id={`${permission.id}-delete`} checked={hasDelete} onChange={hasDeleteChanged} />
          &nbsp;
          <Label htmlFor={`${permission.id}-delete`}>{hasDelete ? 'Yes' : 'No'}</Label>
        </TableColumn>
        <TableColumn>
          <Button
            size="sm"
            onClick={cancelEditMode}
            disabled={editUserPermissionMutation.isPending}
            loading={removeUserPermissionMutation.isPending}
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            size="sm"
            onClick={save}
            disabled={removeUserPermissionMutation.isPending}
            loading={editUserPermissionMutation.isPending}
          >
            Save
          </Button>
        </TableColumn>
      </TableRow>
    )
  }

  return (
    <TableRow hover>
      <TableColumn>{applications[permission.permission!.application.key]}</TableColumn>
      <TableColumn>{permission.permission!.name}</TableColumn>
      <TableColumn>{permission.write ? 'Yes' : 'No'}</TableColumn>
      <TableColumn>{permission.delete ? 'Yes' : 'No'}</TableColumn>
      <TableColumn>
        {!readOnly && (
          <Button
            size="sm"
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
            size="sm"
            onClick={remove}
            disabled={editUserPermissionMutation.isPending}
            loading={removeUserPermissionMutation.isPending}
          >
            Delete
          </Button>
        )}
      </TableColumn>
    </TableRow>
  )
}

export default EditUserPermissionRow
