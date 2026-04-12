import { startRegistration, type PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/browser'
import { useMutation, type MutationOptions } from '@tanstack/react-query'
import { getSessionQueryOptions } from '#actions/queries/get-session.ts'

const registerPasskeyOptions: MutationOptions<void, Error, string> = {
  mutationKey: ['profile', 'passkeys', 'register'] as const,
  mutationFn: async (name: string, { client }) => {
    const registrationResponse = await fetch('/pk/register/start', {
      method: 'POST',
    })
    if (!registrationResponse.ok) {
      throw new Error(`Failed starting registration process: ${registrationResponse.status} ${await registrationResponse.text()}`)
    }

    const optionsJSON = await registrationResponse.json() as PublicKeyCredentialCreationOptionsJSON
    const credential = await startRegistration({ optionsJSON })
      .catch((e) => e as Error)
    if (credential instanceof Error) {
      throw new Error(`Passkey creation failed or canceled: ${credential.message}`)
    }

    const verificationResponse = await fetch('/pk/register/finish', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        data: credential,
        name,
      }),
    })
    if (!verificationResponse.ok) {
      throw new Error('Registration verification failed')
    }

    const { verified } = await verificationResponse.json() as { verified: boolean }
    if (!verified) {
      throw new Error('Registration verification failed')
    }

    await client.invalidateQueries({ queryKey: getSessionQueryOptions().queryKey, exact: true })
  },
}

const useRegisterPasskey = () => useMutation(registerPasskeyOptions)

export default useRegisterPasskey
