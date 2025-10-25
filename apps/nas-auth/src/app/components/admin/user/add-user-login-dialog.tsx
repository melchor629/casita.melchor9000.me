import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useState } from 'preact/hooks'
import { useAddUserLogin } from '../../../actions/mutations/add-user-login'
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Label,
} from '../../ui'

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
    <Dialog open={opened} size="md" portal onClosed={clearState}>
      <DialogHeader onClose={onClose}>Add Local login</DialogHeader>
      <DialogBody>
        <Label htmlFor="password-1">Password</Label>
        <Input type="password" id="password-1" value={password1} onChange={password1Changed} />

        <Label htmlFor="password-2">Repeat Password</Label>
        <Input type="password" id="password-2" value={password2} onChange={password2Changed} />

        <Input type="checkbox" id="disabled" checked={disabled} onChange={disabledChanged} />
        <Label htmlFor="disabled">Disabled</Label>

        {error && <p className="text-orange-700 dark:text-orange-300">{error}</p>}
      </DialogBody>
      <DialogFooter className="text-end">
        <Button onClick={save} loading={addUserLoginMutation.isPending}>Save</Button>
      </DialogFooter>
    </Dialog>
  )
}

export default AddUserLoginDialog
