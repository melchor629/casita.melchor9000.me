import { Link } from '@melchor629/nice-ssr'
import { useMemo } from 'preact/hooks'
import { usePublicUrl, useResolvedProfilePic } from '../../hooks'
import Button from '../ui/button'
import { H1 } from '../ui/text'

type ProfileProps = Readonly<{
  role?: 'admin' | 'user'
  user: {
    userName: string
    displayName?: string
    givenName?: string
    familyName?: string
    profileImageUrl?: string
  }
}>

const Profile = ({ role, user }: ProfileProps) => {
  const publicUrl = usePublicUrl()

  const logoutUrl = useMemo(() => {
    const params = new URLSearchParams({
      post_logout_redirect_uri: publicUrl.startsWith('http:') ? 'https://jwt.io' : publicUrl,
      client_id: 'nas-auth',
    })
    return `/oidc/session/end?${params}`
  }, [publicUrl])

  const resolvedProfilePicUrl = useResolvedProfilePic(user.profileImageUrl)

  return (
    <>
      <H1 className="mb-6">
        Hello again&nbsp;
        {user.givenName || user.userName}
        !
      </H1>

      {resolvedProfilePicUrl && (
        <p className="flex justify-center mb-2">
          <img
            src={resolvedProfilePicUrl}
            alt={`${user.userName} profile`}
            className="w-20 h-20 rounded-full"
          />
        </p>
      )}
      <p className="text-center">
        You are
        {' '}
        {user.displayName || [user.givenName, user.familyName].filter((f) => f).join(' ')}
      </p>
      <p className="text-center opacity-80">
        {user.userName}
      </p>

      <div className="mt-6 flex justify-center flex-wrap">
        <Link to="/profile">
          <Button>Edit profile</Button>
        </Link>
        &nbsp;
        <Button as="a" href={logoutUrl}>Logout</Button>
        {role === 'admin' && (
          <>
            &nbsp;
            <Link to="/admin">
              <Button>Admin</Button>
            </Link>
          </>
        )}
      </div>
    </>
  )
}

export default Profile
