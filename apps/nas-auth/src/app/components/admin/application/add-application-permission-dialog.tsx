import { useRevalidator } from '@melchor629/nice-ssr'
import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useState } from 'preact/hooks'
import { useAddPermission } from '../../../actions/mutations/add-permission'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Label,
} from '../../ui'

type AddApplicationPermissionDialogProps = Readonly<{
  applicationId: string
  opened: boolean
  setOpened: (v: boolean) => void
}>

const AddApplicationPermissionDialog = ({ applicationId, opened, setOpened }: AddApplicationPermissionDialogProps) => {
  const addPermissionMutation = useAddPermission()
  const revalidate = useRevalidator()
  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onClose = useCallback(() => setOpened(false), [setOpened])
  const nameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value), [])
  const displayNameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.currentTarget.value), [])

  const clearState = useCallback(() => {
    setName('')
    setDisplayName('')
    setError(null)
    addPermissionMutation.reset()
  }, [addPermissionMutation])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!name) {
      setError('Name is required')
      return
    }

    setError(null)
    addPermissionMutation.mutate({
      appId: applicationId,
      name,
      displayName: displayName || null,
    }, { onSuccess: () => { setOpened(false); void revalidate() } })
  }, [name, addPermissionMutation, applicationId, displayName, setOpened, revalidate])

  return (
    <Dialog open={opened} size="md" portal onClosed={clearState}>
      <DialogHeader onClose={onClose}>Add Permission</DialogHeader>
      <DialogBody>
        <Label htmlFor="perm-name">Name</Label>
        <Input type="text" id="perm-name" value={name} onChange={nameChanged} />

        <Label htmlFor="perm-name">Display Name</Label>
        <Input type="text" id="perm-name" value={displayName} onChange={displayNameChanged} />

        {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
        {addPermissionMutation.error && <p className="text-orange-700 dark:text-orange-300">{addPermissionMutation.error.message}</p>}
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={save} loading={addPermissionMutation.isPending}>Save</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AddApplicationPermissionDialog
