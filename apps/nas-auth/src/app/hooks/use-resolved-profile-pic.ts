import { useMemo } from 'react'

const nasAuthImageUrl = 'nas-auth://'
const nasAuthImageEndpoint = '/api/user/profile-image'

type Options = {
  profileImageUrl: string | null
  user?: undefined
} | {
  profileImageUrl?: undefined
  user: string
}

const useResolvedProfilePic = ({ profileImageUrl, user }: Options) => (
  useMemo(() => {
    if (!profileImageUrl && !user) {
      return null
    }

    if (!profileImageUrl) {
      return `/api/user/${user}/profile-image`
    }

    if (profileImageUrl.startsWith(nasAuthImageUrl)) {
      return `${nasAuthImageEndpoint}/${profileImageUrl.slice(nasAuthImageUrl.length)}`
    }

    return profileImageUrl
  }, [profileImageUrl, user])
)

export default useResolvedProfilePic
