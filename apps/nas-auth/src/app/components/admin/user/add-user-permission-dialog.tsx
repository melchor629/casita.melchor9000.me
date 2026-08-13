import { useRevalidator } from '@melchor629/nice-ssr'
import { Button, Checkbox, Dialog, FormControlLabel, InputLabel, Select } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useAddUserPermission } from '#actions/mutations/add-user-permission.ts'
import type { GetApplications } from '#queries/application/get-applications.ts'
import type { GetPermissions } from '#queries/permission/get-permissions.ts'

type AddUserPermissionDialogProps = Readonly<{
  allApplications: GetApplications
  allPermissions: GetPermissions
  opened: boolean
  setOpened: (v: boolean) => void
  userName: string
}>

const AddUserPermissionDialog = ({
  allApplications,
  allPermissions,
  opened,
  setOpened,
  userName,
}: AddUserPermissionDialogProps) => {
  const revalidator = useRevalidator()
  const addUserPermissionMutation = useAddUserPermission()
  const [applicationId, setApplicationId] = useState('')
  const [permission, setPermission] = useState<GetPermissions[0] | null>(null)
  const [hasWrite, setHasWrite] = useState(false)
  const [hasDelete, setHasDelete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const applications = useMemo(() => Object.freeze(allApplications.map((a) => [a.key, a.name] as const)), [allApplications])
  const permissionsForApplication = useMemo(
    () => allPermissions.filter((perm) => perm.applicationKey === applicationId),
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
      userName,
      permissionName: permission.name,
      applicationKey: permission.applicationKey,
      write: hasWrite,
      delete: hasDelete,
    }, {
      onSuccess: () => {
        setOpened(false)
        void revalidator()
      },
    })
  }, [applicationId, permission, addUserPermissionMutation, userName, hasWrite, hasDelete, setOpened, revalidator])

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
          value={[applicationId, ''] as const}
          onChange={useCallback((app: readonly [string, string] | null) => setApplicationId(app ? app[0] : ''), [])}
          values={applications}
          keySelector={useCallback(([k]: readonly [string, string]) => k, [])}
          labelSelector={useCallback(([, v]: readonly [string, string]) => v, [])}
          emptyValue={['', 'Select One'] as const}
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
          keySelector={useCallback((p: GetPermissions[0]) => p.name, [])}
          labelSelector={useCallback((p: GetPermissions[0]) => p.displayName ?? p.name, [])}
          emptyValue={{ name: '', applicationKey: '', displayName: 'Select One' }}
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
