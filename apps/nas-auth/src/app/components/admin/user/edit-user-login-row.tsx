import type { ChangeEvent, MouseEvent } from 'preact/compat'
import { useCallback, useEffect, useState } from 'preact/hooks'
import { useEditUserLogin } from '../../../actions/mutations/edit-user-login'
import { useRemoveUserLogin } from '../../../actions/mutations/remove-user-login'
import type { GetUserQuery } from '../../../../queries/get-user'
import {
  Button,
  Input,
  Label,
  TableColumn,
  TableRow,
} from '../../ui'
import EditLoginDataDialog from './edit-login-data-dialog'
import LoginDataDialog from './login-data-dialog'

type EditUserLoginRowProps = Readonly<{
  canDelete: boolean
  login: NonNullable<GetUserQuery['logins']>[0]
  readOnly: boolean
  userId: number
}>

const EditUserLoginRow = ({
  canDelete,
  login,
  readOnly,
  userId,
}: EditUserLoginRowProps) => {
  const editUserLoginMutation = useEditUserLogin()
  const removeUserLoginMutation = useRemoveUserLogin()
  const [editMode, setEditMode] = useState(false)
  const [loginData, setLoginData] = useState<unknown>(login.data)
  const [isDisabled, setIsDisabled] = useState(login.disabled)
  const [opened, setOpened] = useState(false)

  const cancelEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(false)
    setOpened(false)
  }, [])

  const activateEditMode = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setEditMode(true)
    setOpened(false)
  }, [])

  const isDisabledChanged = useCallback((e: ChangeEvent<HTMLInputElement>) => setIsDisabled(e.currentTarget.checked), [])

  const openData = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setOpened(true)
  }, [])

  const editLoginDataClose = useCallback((data?: unknown) => {
    if (data !== undefined) {
      setLoginData(data)
    }

    setOpened(false)
  }, [])

  const save = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly) {
      return
    }

    editUserLoginMutation.mutate({
      disabled: isDisabled,
      data: loginData,
      loginId: login.id,
      userId,
    }, { onSuccess: () => setEditMode(false) })
  }, [readOnly, editUserLoginMutation, isDisabled, loginData, login.id, userId])

  const remove = useCallback((e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (readOnly || !canDelete) {
      return
    }

    removeUserLoginMutation.mutate({
      loginId: login.id,
      userId,
    })
  }, [readOnly, canDelete, removeUserLoginMutation, login.id, userId])

  useEffect(() => {
    setLoginData(login.data)
    setIsDisabled(login.disabled)
  }, [login])

  if (editMode) {
    return (
      <TableRow hover>
        <TableColumn>{login.type}</TableColumn>
        <TableColumn><code>{login.loginId}</code></TableColumn>
        <TableColumn>
          <Button size="sm" onClick={openData}>Edit</Button>
        </TableColumn>
        <TableColumn className="select-none">
          <Input type="checkbox" id={`${login.id}-disabled`} checked={isDisabled} onChange={isDisabledChanged} />
          &nbsp;
          <Label htmlFor={`${login.id}-disabled`}>{isDisabled ? 'Yes' : 'No'}</Label>
        </TableColumn>
        <TableColumn>
          <Button
            size="sm"
            onClick={cancelEditMode}
            disabled={editUserLoginMutation.isPending || removeUserLoginMutation.isPending}
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            size="sm"
            onClick={save}
            loading={editUserLoginMutation.isPending}
          >
            Save
          </Button>
        </TableColumn>

        <EditLoginDataDialog data={loginData} opened={opened} close={editLoginDataClose} />
      </TableRow>
    )
  }

  return (
    <TableRow hover>
      <TableColumn>{login.type}</TableColumn>
      <TableColumn><code>{login.loginId}</code></TableColumn>
      <TableColumn>
        {login.data ? <Button size="sm" onClick={openData}>See</Button> : ''}
      </TableColumn>
      <TableColumn>{login.disabled ? 'Yes' : 'No'}</TableColumn>
      <TableColumn>
        {!readOnly && <Button size="sm" onClick={activateEditMode} disabled={removeUserLoginMutation.isPending}>Edit</Button>}
        &nbsp;
        {!readOnly && canDelete && (
          <Button
            size="sm"
            onClick={remove}
            disabled={editUserLoginMutation.isPending}
            loading={removeUserLoginMutation.isPending}
          >
            Delete
          </Button>
        )}
      </TableColumn>

      <LoginDataDialog data={login.data as unknown} opened={opened} setOpened={setOpened} />
    </TableRow>
  )
}

export default EditUserLoginRow
