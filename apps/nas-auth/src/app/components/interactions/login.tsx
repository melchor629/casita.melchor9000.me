import { Link } from '@melchor629/nice-ssr'
import { Alert, Button, Text, TextInput } from '@melchor629/ui'
import { AccountCircle, ArrowLeftAlt, ArrowRightAlt, Github, Google, KeyVertical } from '@melchor629/ui/icons'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useMemo, useState } from 'react'
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
  const [isPasswordStep, setIsPasswordStep] = useState(!!username)
  const postExternalCallback = useMemo(() => new URLSearchParams({
    uid: interaction.uid,
  }).toString(), [interaction.uid])

  const hasGoogleAuth = useMemo(() => externalAuths.includes('google'), [externalAuths])
  const hasGithubAuth = useMemo(() => externalAuths.includes('github'), [externalAuths])
  const showPasswordStep = useCallback(() => setIsPasswordStep(true), [])
  const backToMethodsStep = useCallback(() => setIsPasswordStep(false), [])

  return (
    <>
      <Text size="h2" className="mb-5">Sign In</Text>

      <div className="relative w-full mb-6">
        <AnimatePresence mode="wait" initial={false}>
          {!isPasswordStep && (
            <motion.div
              key="login-method"
              initial={{ opacity: 0, translateX: -8 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: -8 }}
            >
              <div className="flex flex-col justify-center gap-y-1.5 mb-4">
                {hasGoogleAuth && (
                  <Button
                    component="a"
                    href={`/auth/google?${postExternalCallback}`}
                    referrerPolicy="no-referrer"
                    icon={<Google />}
                    color="secondary"
                  >
                    Sign in with Google
                  </Button>
                )}
                {hasGithubAuth && (
                  <Button
                    component="a"
                    href={`/auth/github?${postExternalCallback}`}
                    referrerPolicy="no-referrer"
                    icon={<Github />}
                    color="secondary"
                  >
                    Sign in with GitHub
                  </Button>
                )}
                <Button
                  icon={<KeyVertical />}
                  color="secondary"
                  onClick={showPasswordStep}
                >
                  Sign in with password
                </Button>
              </div>

              <div className="flex flex-col">
                <Link
                  to={`/i/${interaction.uid}/cancel`}
                >
                  <Button className="w-full" variant="text" color="neutral">Cancel</Button>
                </Link>
              </div>
            </motion.div>
          )}

          {isPasswordStep && (
            <motion.form
              key="password"
              autoComplete="off"
              action={`/i/${interaction.uid}/login`}
              method="POST"
              initial={{ opacity: 0, translateX: 8 }}
              animate={{ opacity: 1, translateX: 0 }}
              exit={{ opacity: 0, translateX: 8 }}
            >
              {typeof interaction.params.login_error === 'string' && (
                <Alert severity="error" title="Could not sign in" className="mb-4">
                  {interaction.params.login_error}
                </Alert>
              )}

              <TextInput
                type="text"
                required
                name="username"
                placeholder="User Name/Email"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={!interaction.params.login_hint}
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
                className="mb-2"
                startAdornment={<AccountCircle className="px-0.5" />}
              />

              <TextInput
                type="password"
                required
                name="password"
                placeholder="Password"
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus={!!interaction.params.login_hint}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
                className="mb-4"
                startAdornment={<KeyVertical className="px-0.5" />}
              />

              <div className="flex flex-col gap-1.5">
                <Button type="submit" icon={<ArrowRightAlt />}>Sign in</Button>
                <Button
                  type="button"
                  variant="text"
                  color="neutral"
                  icon={<ArrowLeftAlt />}
                  onClick={backToMethodsStep}
                >
                  Back
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <InteractionFooter client={client} />
    </>
  )
}

export default Login
