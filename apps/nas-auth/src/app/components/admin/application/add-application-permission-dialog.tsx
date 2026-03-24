import { useRevalidator } from '@melchor629/nice-ssr'
import { Button, Dialog, FormControlLabel, TextInput } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useState } from 'react'
import { useAddPermission } from '../../../actions/mutations/add-permission'

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
    <Dialog
      id="add-application-permission"
      show={opened}
      size="medium"
      portal
      title="Add Permission"
      onClose={onClose}
      onCloseEnd={clearState}
      buttons={[
        <Button key="save" onClick={save} loading={addPermissionMutation.isPending}>Save</Button>,
      ]}
    >
      <FormControlLabel htmlFor="perm-name">Name</FormControlLabel>
      <TextInput type="text" id="perm-name" value={name} onChange={nameChanged} />

      <FormControlLabel htmlFor="perm-name" margin="none">Display Name</FormControlLabel>
      <TextInput type="text" id="perm-name" value={displayName} onChange={displayNameChanged} />

      {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
      {addPermissionMutation.error && <p className="text-orange-700 dark:text-orange-300">{addPermissionMutation.error.message}</p>}
    </Dialog>
  )
}

export default AddApplicationPermissionDialog
