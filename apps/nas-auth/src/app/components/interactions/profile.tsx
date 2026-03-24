import { Link } from '@melchor629/nice-ssr'
import { Button, Text } from '@melchor629/ui'
import { Logout, PersonEdit, Settings } from '@melchor629/ui/icons'
import { useMemo } from 'react'
import { usePublicUrl, useResolvedProfilePic } from '../../hooks'

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
      <Text size="h1" className="mb-6">
        Hello again&nbsp;
        {user.givenName || user.userName}
        !
      </Text>

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

      <div className="mt-6 flex justify-center flex-wrap gap-1.5">
        <Link to="/profile">
          <Button icon={<PersonEdit />}>Edit profile</Button>
        </Link>
        {role === 'admin' && (
          <Link to="/admin">
            <Button variant="text" color="secondary" icon={<Settings />}>Admin</Button>
          </Link>
        )}
        <Button
          component="a"
          href={logoutUrl}
          color="error"
          variant="text"
          icon={<Logout />}
        >
          Logout
        </Button>
      </div>
    </>
  )
}

export default Profile
