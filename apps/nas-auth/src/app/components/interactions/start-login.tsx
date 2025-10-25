import { useCallback } from 'preact/hooks'
import { usePublicUrl } from '../../hooks'
import Button from '../ui/button'
import { H1 } from '../ui/text'

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
      <H1 className="mb-4">Hello again!</H1>
      <Button type="button" onClick={startLoginProcess}>Login</Button>
    </>
  )
}

export default StartLogin
