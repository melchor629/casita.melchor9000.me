import { Button, Checkbox, Dialog, FormControlLabel, InputLabel, Select } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useAddUserPermission } from '#actions/mutations/add-user-permission.ts'
import type { GetPermissions } from '#queries/get-permissions.ts'

type AddUserPermissionDialogProps = Readonly<{
  allPermissions: GetPermissions
  opened: boolean
  setOpened: (v: boolean) => void
  userId: number
}>

const AddUserPermissionDialog = ({
  allPermissions,
  opened,
  setOpened,
  userId,
}: AddUserPermissionDialogProps) => {
  const addUserPermissionMutation = useAddUserPermission()
  const [applicationId, setApplicationId] = useState('')
  const [permission, setPermission] = useState<GetPermissions[0] | null>(null)
  const [hasWrite, setHasWrite] = useState(false)
  const [hasDelete, setHasDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const applications = useMemo(() => Object.entries(Object.fromEntries(
    allPermissions
      .map((perm) => perm.application)
      .map((app) => [app.key, app.name]),
  )), [allPermissions])
  const permissionsForApplication = useMemo(
    () => allPermissions.filter((perm) => perm.application.key === applicationId),
    [allPermissions, applicationId],
  )

  const onClose = useCallback(() => setOpened(false), [setOpened])

  const clearState = useCallback(() => {
    setApplicationId('')
    setPermission(null)
    setHasDelete(false)
    setHasWrite(false)
    addUserPermissionMutation.reset()
  }, [addUserPermissionMutation])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!applicationId) {
      setError('Application is required')
      return
    }

    if (!permission) {
      setError('Permission is required')
      return
    }

    setError(null)
    addUserPermissionMutation.mutate({
      userId,
      permissionId: permission.id,
      write: hasWrite,
      delete: hasDelete,
    }, {
      onSuccess: () => setOpened(false),
    })
  }, [setOpened, addUserPermissionMutation, userId, applicationId, permission, hasWrite, hasDelete])

  return (
    <Dialog
      id="add-user-permission"
      show={opened}
      size="medium"
      portal
      title="Add Permission"
      onClose={onClose}
      onCloseEnd={clearState}
      buttons={[
        <Button key="save" onClick={save} loading={addUserPermissionMutation.isPending}>Save</Button>,
      ]}
    >
      <div className="mb-2">
        <FormControlLabel htmlFor="application-id">Application</FormControlLabel>
        &nbsp;
        <Select
          id="application-id"
          value={[applicationId, '']}
          onChange={useCallback((app: [string, string] | null) => setApplicationId(app ? app[0] : ''), [])}
          values={applications}
          keySelector={useCallback(([k]: [string, string]) => k, [])}
          labelSelector={useCallback(([, v]: [string, string]) => v, [])}
          emptyValue={['', 'Select One']}
        />
      </div>

      <div className="mb-2">
        <FormControlLabel htmlFor="permission">Permission</FormControlLabel>
        &nbsp;
        <Select
          id="permission"
          value={permission}
          onChange={setPermission}
          values={permissionsForApplication}
          keySelector={useCallback((p: GetPermissions[0]) => p.id.toString(), [])}
          labelSelector={useCallback((p: GetPermissions[0]) => p.name, [])}
          emptyValue={{ id: -1, name: 'Select One' } as GetPermissions[0]}
        />
      </div>

      <div>
        <InputLabel
          input={
            <Checkbox
              type="checkbox"
              id="has-write"
              checked={hasWrite}
              onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setHasWrite(e.currentTarget.checked), [])}
            />
          }
        >
          Write?
        </InputLabel>
      </div>

      <div>
        <InputLabel
          input={
            <Checkbox
              type="checkbox"
              id="has-delete"
              checked={hasDelete}
              onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setHasDelete(e.currentTarget.checked), [])}
            />
          }
        >
          Delete?
        </InputLabel>
      </div>

      {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
    </Dialog>
  )
}

export default AddUserPermissionDialog
