import { useNavigate } from '@melchor629/nice-ssr'
import { Button, Checkbox, Dialog, FormControlLabel, InputLabel, TextInput } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useState } from 'react'
import { useAddUser } from '../../../actions/mutations/add-user'

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
    <Dialog
      show={opened}
      size="medium"
      id="add-user-dialog"
      portal
      onClose={onClose}
      onCloseEnd={clearState}
      title="Add User"
      buttons={[
        <Button key="save" onClick={save} loading={addUserMutation.isPending}>Save</Button>,
      ]}
    >
      <FormControlLabel htmlFor="user-name">User Name</FormControlLabel>
      <TextInput type="text" id="user-name" value={userName} onChange={userNameChanged} />

      <FormControlLabel htmlFor="display-name" className="mt-2">Display Name</FormControlLabel>
      <TextInput type="text" id="display-name" value={displayName} onChange={displayNameChanged} />

      <InputLabel
        input={<Checkbox id="disabled" checked={disabled} onChange={disabledChanged} />}
        className="mt-2"
      >
        Disabled
      </InputLabel>

      {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
      {addUserMutation.error && <p className="text-orange-700 dark:text-orange-300">{addUserMutation.error.message}</p>}
    </Dialog>
  )
}

export default AddUserDialog
