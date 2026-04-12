import { Checkbox, Text } from '@melchor629/ui'
import { Github, Google, KeyVertical, Passkey } from '@melchor629/ui/icons'
import { useCallback } from 'react'
import { useToggleUserLogin } from '#actions/mutations/toggle-user-login.ts'

type Login = { id: string, disabled: boolean, type: string, name?: string | null }
const LoginRow = ({ login: { disabled, id, name, type } }: { readonly login: Login }) => {
  const toggleUserLogin = useToggleUserLogin()

  const toggle = useCallback(() => {
    toggleUserLogin.mutate({ id, type })
  }, [toggleUserLogin, id, type])

  return (
    <div className="inline-flex w-full gap-1 items-center">
      <div className="leading-0 mr-0.5">
        <Checkbox name={id} checked={!disabled} disabled={toggleUserLogin.isPending} onChange={toggle} />
      </div>
      {type === 'github' && <Github />}
      {type === 'google' && <Google />}
      {type === 'local' && <KeyVertical />}
      {type === 'passkey' && <Passkey />}
      <Text ellipsize>{` ${name ?? id}`}</Text>
    </div>
  )
}

export default LoginRow
