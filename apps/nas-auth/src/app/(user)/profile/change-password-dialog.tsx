import { Button, Dialog, FormControl, TextInput } from '@melchor629/ui'
import { useCallback, useMemo, useRef, type SubmitEvent } from 'react'
import { ValidationError } from '#actions/helpers.ts'
import { useChangeUserPassword } from '#actions/mutations/change-user-password.ts'
import { useGetSession } from '#actions/queries/get-session.ts'

export default function ChangePasswordDialog({ onClose, show }: Readonly<{ show: boolean, onClose(): void }>) {
  const { data } = useGetSession()
  const login = useMemo(() => data?.user.logins.find((l) => l.type === 'local'), [data])
  const formRef = useRef<HTMLDivElement>(null)
  const changeUserPassword = useChangeUserPassword()
  const validations = useMemo(
    () => changeUserPassword.error instanceof ValidationError
      ? changeUserPassword.error.fields
      : {},
    [changeUserPassword.error],
  )
  return (
    <Dialog
      id="change-password"
      title={login ? 'Change password' : 'Create password'}
      show={show}
      onClose={onClose}
      buttons={[
        <Button key="change" type="submit" loading={changeUserPassword.isPending}>
          Change
        </Button>,
      ]}
      slots={{
        container: 'form',
      }}
      slotProps={{
        container: {
          ref: formRef,
          onSubmit: useCallback((e: SubmitEvent<HTMLDivElement>) => {
            e.preventDefault()
            changeUserPassword.mutate(new FormData(e.target), {
              onSuccess: () => onClose(),
            })
          }, [changeUserPassword, onClose]),
        },
      }}
      portal
      onCloseEnd={useCallback(() => {
        (formRef.current as unknown as HTMLFormElement)?.reset()
        changeUserPassword.reset()
      }, [changeUserPassword])}
    >
      {login && (
        <FormControl
          label="Current password"
          htmlFor="currentPassword"
          className="mb-2"
          error={validations.currentPassword}
          helperText="Type your current password"
        >
          <TextInput
            type="password"
            required
            id="currentPassword"
            name="currentPassword"
          />
        </FormControl>
      )}

      <FormControl
        label="New password"
        htmlFor="newPassword1"
        className="mb-2"
        error={validations.newPassword1}
        helperText="The password must have one lower case letter (a-z), one upper case letter (A-Z) and a digit (0-9), with length of 6 or higher"
      >
        <TextInput
          type="password"
          required
          id="newPassword1"
          name="newPassword1"
        />
      </FormControl>

      <FormControl
        label="New password again"
        htmlFor="newPassword2"
        className="mb-2"
        error={validations.newPassword2}
        helperText="Type the new password again here"
      >
        <TextInput
          type="password"
          required
          id="newPassword2"
          name="newPassword2"
        />
      </FormControl>
    </Dialog>
  )
}
