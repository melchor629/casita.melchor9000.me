import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useMemo, useState } from 'preact/hooks'
import { useAddUserPermission } from '#actions/mutations/add-user-permission.ts'
import type { GetPermissions } from '#queries/get-permissions.ts'
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
    <Dialog open={opened} size="md" portal onClosed={clearState}>
      <DialogHeader onClose={onClose}>Add Permission</DialogHeader>
      <DialogBody>
        <div className="mb-2">
          <Label htmlFor="application-id">Application</Label>
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
          <Label htmlFor="permission">Permission</Label>
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
          <Input
            type="checkbox"
            id="has-write"
            checked={hasWrite}
            onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setHasWrite(e.currentTarget.checked), [])}
          />
          <Label htmlFor="has-write">Write?</Label>
        </div>

        <div>
          <Input
            type="checkbox"
            id="has-delete"
            checked={hasDelete}
            onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => setHasDelete(e.currentTarget.checked), [])}
          />
          <Label htmlFor="has-delete">Delete?</Label>
        </div>

        {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={save} loading={addUserPermissionMutation.isPending}>Save</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AddUserPermissionDialog
