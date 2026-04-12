import { Alert, Button, Dialog, FormControl, TextInput } from '@melchor629/ui'
import { useCallback, useRef, type SubmitEvent } from 'react'
import useRegisterPasskey from '#actions/mutations/register-passkey.ts'

export default function RegisterPasskeyDialog({ onClose, show }: Readonly<{ show: boolean, onClose(): void }>) {
  const formRef = useRef<HTMLDivElement>(null)
  const registerPasskey = useRegisterPasskey()

  return (
    <Dialog
      id="register-passkey"
      title="Register passkey"
      show={show}
      onClose={onClose}
      buttons={[
        <Button key="register" type="submit" loading={registerPasskey.isPending}>
          Register
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
            const formData = new FormData(e.target as HTMLFormElement)
            registerPasskey.mutate(formData.get('name')! as string, {
              onSuccess: () => onClose(),
            })
          }, [registerPasskey, onClose]),
        },
      }}
      portal
      onCloseEnd={useCallback(() => {
        (formRef.current as unknown as HTMLFormElement)?.reset()
        registerPasskey.reset()
      }, [registerPasskey])}
    >
      {registerPasskey.error && (
        <Alert title="Passkey registration failed" severity="error" className="mb-1">
          {registerPasskey.error.message}
        </Alert>
      )}

      <FormControl
        label="Passkey name"
        htmlFor="name"
        className="mb-2"
        helperText="Give a name to the passkey so it is easier to identify"
      >
        <TextInput
          type="text"
          required
          minLength={3}
          id="name"
          name="name"
        />
      </FormControl>
    </Dialog>
  )
}
