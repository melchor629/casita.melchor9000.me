import { Button, Text } from '@melchor629/ui'
import { useCallback } from 'react'
import { usePublicUrl } from '../../hooks'

const StartLogin = () => {
  const publicUrl = usePublicUrl()

  const startLoginProcess = useCallback(() => {
    const isDev = publicUrl.startsWith('http:')
    const params = new URLSearchParams({
      response_type: 'id_token',
      client_id: 'nas-auth',
      redirect_uri: isDev ? 'https://jwt.io' : publicUrl,
      nonce: 'foobar',
      scope: 'openid email profile',
      prompt: 'login',
    })
    const url = `/oidc/auth?${params}`
    if (isDev) {
      window.open(url, 'login')
    } else {
      window.location.assign(url)
    }
  }, [publicUrl])

  return (
    <>
      <Text className="mb-4" size="h1">Hello again!</Text>
      <Button type="button" onClick={startLoginProcess}>Login</Button>
    </>
  )
}

export default StartLogin
