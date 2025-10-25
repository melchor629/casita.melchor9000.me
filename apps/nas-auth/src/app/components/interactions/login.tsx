import { Link } from '@melchor629/nice-ssr'
import { motion } from 'motion/react'
import { useMemo, useState } from 'preact/hooks'
import {
  Button,
  H2,
  IconGithub,
  IconGoogle,
  Input,
} from '../ui'
import InteractionFooter from './interaction-footer'
import type { Client, ExternalAuths, Interaction } from './types'

type LoginProps = Readonly<{
  client: Client
  externalAuths: ExternalAuths
  interaction: Interaction
}>

const Login = ({ client, externalAuths, interaction }: LoginProps) => {
  const [username, setUsername] = useState(interaction.params.login_hint as string ?? '')
  const [password, setPassword] = useState('')
  const postExternalCallback = useMemo(() => new URLSearchParams({
    uid: interaction.uid,
  }).toString(), [interaction.uid])

  const hasExternalAuth = useMemo(() => externalAuths.length, [externalAuths])
  const hasGoogleAuth = useMemo(() => externalAuths.includes('google'), [externalAuths])
  const hasGithubAuth = useMemo(() => externalAuths.includes('github'), [externalAuths])

  return (
    <>
      <H2 className="mb-5">Sign In</H2>

      {typeof interaction.params.login_error === 'string' && (
        <p className="text-center text-red-600 dark:text-red-400 p-2 my-5 border border-red-600 dark:border-red-400 rounded-md">
          {interaction.params.login_error}
        </p>
      )}

      {hasExternalAuth && (
        <div className="flex flex-col gap-y-2 mb-6">
          {hasGoogleAuth && (
            <Button as="a" href={`/auth/google?${postExternalCallback}`}>
              <IconGoogle height={18} className="inline-block align-text-bottom mr-2" />
              <span>Sign in with Google</span>
            </Button>
          )}
          {hasGithubAuth && (
            <Button as="a" href={`/auth/github?${postExternalCallback}`}>
              <IconGithub height={18} className="inline-block align-text-bottom mr-2" />
              <span>Sign in with Github</span>
            </Button>
          )}
        </div>
      )}

      <motion.form
        autoComplete="off"
        action={`/i/${interaction.uid}/login`}
        method="POST"
        className="mb-6 overflow-y-hidden"
        initial={{ maxHeight: '32px' }}
        animate={{ maxHeight: username ? '114px' : '32px' }}
      >
        <Input
          type="text"
          required
          name="username"
          placeholder="User Name/Email"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={!interaction.params.login_hint}
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
        />

        <Input
          type="password"
          required
          name="password"
          placeholder="Password"
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={!!interaction.params.login_hint}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
        />

        <div className="flex flex-col mt-2">
          <Button type="submit">Sign in</Button>
        </div>
      </motion.form>

      <div className="flex flex-col mb-6">
        <Link
          to={`/i/${interaction.uid}/cancel`}
        >
          <Button>Cancel</Button>
        </Link>
      </div>

      <InteractionFooter client={client} />
    </>
  )
}

export default Login
