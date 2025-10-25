import { useNavigate } from '@melchor629/nice-ssr'
import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useState } from 'preact/hooks'
import { useAddUser } from '../../../actions/mutations/add-user'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Label,
} from '../../ui'

type AddUserDialogProps = Readonly<{
  opened: boolean
  setOpened: (v: boolean) => void
}>

const AddUserDialog = ({ opened, setOpened }: AddUserDialogProps) => {
  const [userName, setUserName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [disabled, setDisabled] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const addUserMutation = useAddUser()
  const navigate = useNavigate()

  const onClose = useCallback(() => setOpened(false), [setOpened])
  const userNameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setUserName(e.currentTarget.value), [])
  const displayNameChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setDisplayName(e.currentTarget.value), [])
  const disabledChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setDisabled(e.currentTarget.checked), [])

  const clearState = useCallback(() => {
    setUserName('')
    setDisplayName('')
    setDisabled(true)
    setError(null)
    addUserMutation.reset()
  }, [addUserMutation])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!userName) {
      setError('User Name is required')
      return
    }

    setError(null)
    addUserMutation.mutate({
      userName,
      disabled,
      displayName,
    }, {
      onSuccess(newUser) {
        if (newUser) {
          navigate(`/admin/users/${newUser.id}`)
        } else {
          setError('Could not create user')
        }
      },
    })
  }, [navigate, addUserMutation, userName, displayName, disabled])

  return (
    <Dialog open={opened} size="md" portal onClosed={clearState}>
      <DialogHeader onClose={onClose}>Add User</DialogHeader>
      <DialogBody>
        <Label htmlFor="user-name">User Name</Label>
        <Input type="text" id="user-name" value={userName} onChange={userNameChanged} />

        <Label htmlFor="display-name">Display Name</Label>
        <Input type="text" id="display-name" value={displayName} onChange={displayNameChanged} />

        <Input type="checkbox" id="disabled" checked={disabled} onChange={disabledChanged} />
        <Label htmlFor="disabled">Disabled</Label>

        {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
        {addUserMutation.error && <p className="text-orange-700 dark:text-orange-300">{addUserMutation.error.message}</p>}
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={save} disabled={addUserMutation.isPending}>Save</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AddUserDialog
