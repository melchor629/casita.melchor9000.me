import { Button, Checkbox, InputLabel, TableCell, TableRow } from '@melchor629/ui'
import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useEditUserLogin } from '#actions/mutations/edit-user-login.ts'
import { useRemoveUserLogin } from '#actions/mutations/remove-user-login.ts'
import type { GetUserQuery } from '#queries/get-user.ts'
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
  const [loginData, setLoginData] = useState(login.data as Record<string, unknown> | null)
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

  const editLoginDataClose = useCallback((data?: Record<string, unknown> | null) => {
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
    }, { onSuccess: () => setEditMode(false) })
  }, [readOnly, editUserLoginMutation, isDisabled, loginData, login.id])

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoginData(login.data as Record<string, unknown> | null)
    setIsDisabled(login.disabled)
  }, [login])

  if (editMode) {
    return (
      <TableRow>
        <TableCell>{login.type}</TableCell>
        <TableCell><code>{login.loginId}</code></TableCell>
        <TableCell>
          <Button size="small" onClick={openData} variant="text">Edit</Button>
        </TableCell>
        <TableCell className="select-none">
          <InputLabel
            input={<Checkbox id={`${login.id}-disabled`} checked={isDisabled} onChange={isDisabledChanged} />}
          >
            {isDisabled ? 'Yes' : 'No'}
          </InputLabel>
        </TableCell>
        <TableCell noWrap>
          <Button
            size="small"
            onClick={cancelEditMode}
            disabled={editUserLoginMutation.isPending || removeUserLoginMutation.isPending}
            variant="text"
            color="secondary"
          >
            Cancel
          </Button>
          &nbsp;
          <Button
            size="small"
            onClick={save}
            loading={editUserLoginMutation.isPending}
            variant="text"
          >
            Save
          </Button>
        </TableCell>

        <EditLoginDataDialog data={loginData} opened={opened} close={editLoginDataClose} />
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell>{login.type}</TableCell>
      <TableCell><code>{login.loginId}</code></TableCell>
      <TableCell>
        {login.data ? <Button size="small" onClick={openData} variant="text">See</Button> : ''}
      </TableCell>
      <TableCell>{login.disabled ? 'Yes' : 'No'}</TableCell>
      <TableCell noWrap>
        {!readOnly && <Button size="small" onClick={activateEditMode} disabled={removeUserLoginMutation.isPending} variant="text">Edit</Button>}
        &nbsp;
        {!readOnly && canDelete && (
          <Button
            size="small"
            onClick={remove}
            disabled={editUserLoginMutation.isPending}
            loading={removeUserLoginMutation.isPending}
            variant="text"
            color="error"
          >
            Delete
          </Button>
        )}
      </TableCell>

      <LoginDataDialog data={login.data} opened={opened} setOpened={setOpened} />
    </TableRow>
  )
}

export default EditUserLoginRow
