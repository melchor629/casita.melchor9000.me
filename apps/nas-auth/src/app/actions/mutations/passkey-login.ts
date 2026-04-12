import { startAuthentication, type PublicKeyCredentialRequestOptionsJSON } from '@simplewebauthn/browser'
import { useMutation, type MutationOptions } from '@tanstack/react-query'

const passkeyLoginOptions: MutationOptions = {
  mutationKey: ['login', 'passkey'] as const,
  mutationFn: async () => {
    const authenticationResponse = await fetch(`${location.pathname}/pk/start`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!authenticationResponse.ok) {
      throw new Error(`Failed starting login process: ${authenticationResponse.status} ${await authenticationResponse.text()}`)
    }

    const optionsJSON = await authenticationResponse.json() as PublicKeyCredentialRequestOptionsJSON
    const credential = await startAuthentication({ optionsJSON })
      .catch((e) => e as Error)
    if (credential instanceof Error) {
      throw new Error(`Passkey login failed or canceled: ${credential.message}`)
    }

    const verificationResponse = await fetch(`${location.pathname}/pk/finish`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        data: credential,
      }),
      redirect: 'manual',
    })

    if (!verificationResponse.ok) {
      const text = await verificationResponse.json().catch(() => ({})) as { message?: string }
      throw new Error(`Login verification failed: ${text.message || 'unknown error (retry pls)'}`)
    }

    const { location: url, verified } = await verificationResponse.json() as { verified: false, location: undefined } | { verified: true, location: string }
    if (!verified) {
      throw new Error('Login verification failed')
    }

    window.location.assign(url)
  },
}

const usePasskeyLogin = () => useMutation(passkeyLoginOptions)

export default usePasskeyLogin
