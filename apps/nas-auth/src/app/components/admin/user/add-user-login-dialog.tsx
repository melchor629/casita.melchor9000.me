import { Button, Checkbox, Dialog, FormControlLabel, InputLabel, TextInput } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useState } from 'react'
import { useAddUserLogin } from '../../../actions/mutations/add-user-login'

const getLoginId = async (userName: string, password: string) => {
  const value = `_${password}@${userName}_`
  const binaryValue = new TextEncoder().encode(value)
  const binaryLoginId = await crypto.subtle.digest('SHA-512', binaryValue)
  const loginId = [...new Uint8Array(binaryLoginId)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return loginId
}

type AddUserLoginDialogProps = Readonly<{
  opened: boolean
  setOpened: (v: boolean) => void
  userId: number
  userName: string
}>

const AddUserLoginDialog = ({ opened, setOpened, userId, userName }: AddUserLoginDialogProps) => {
  const addUserLoginMutation = useAddUserLogin()
  const [password1, setPassword1] = useState('')
  const [password2, setPassword2] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onClose = useCallback(() => setOpened(false), [setOpened])
  const password1Changed = useCallback((e: ChangeEvent<HTMLInputElement>) => setPassword1(e.currentTarget.value), [])
  const password2Changed = useCallback((e: ChangeEvent<HTMLInputElement>) => setPassword2(e.currentTarget.value), [])
  const disabledChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setDisabled(e.currentTarget.checked), [])

  const clearState = useCallback(() => {
    setPassword1('')
    setPassword2('')
    setDisabled(false)
    setError(null)
    addUserLoginMutation.reset()
  }, [addUserLoginMutation])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!password1 || !password2) {
      setError('Password is required')
      return
    }

    if (password1 !== password2) {
      setError('Passwords mismatch')
      return
    }

    setError(null)
    getLoginId(userName, password1)
      .then((loginId) => {
        return addUserLoginMutation.mutateAsync({
          userId,
          type: 'local',
          data: null,
          disabled,
          loginId,
        })
      })
      .then(() => setOpened(false))
      .catch(() => {})
  }, [setOpened, addUserLoginMutation, userId, userName, disabled, password1, password2])

  return (
    <Dialog
      id="add-user-login"
      show={opened}
      size="medium"
      portal
      title="Add Local login"
      onClose={onClose}
      onCloseEnd={clearState}
      buttons={[
        <Button key="save" onClick={save} loading={addUserLoginMutation.isPending}>Save</Button>,
      ]}
    >
      <FormControlLabel htmlFor="password-1">Password</FormControlLabel>
      <TextInput type="password" id="password-1" value={password1} onChange={password1Changed} />

      <FormControlLabel htmlFor="password-2" margin="normal">Repeat Password</FormControlLabel>
      <TextInput type="password" id="password-2" value={password2} onChange={password2Changed} />

      <InputLabel
        input={<Checkbox id="disabled" checked={disabled} onChange={disabledChanged} />}
        margin="normal"
      >
        Disabled
      </InputLabel>

      {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
    </Dialog>
  )
}

export default AddUserLoginDialog
