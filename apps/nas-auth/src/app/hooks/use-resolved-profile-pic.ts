import { useMemo } from 'preact/hooks'

const nasAuthImageUrl = 'nas-auth://'
const nasAuthImageEndpoint = '/api/user/profile-image'

const useResolvedProfilePic = (profileImageUrl?: string | null, user?: string) => (
  useMemo(() => {
    if (!profileImageUrl) {
      return null
    }

    if (profileImageUrl.startsWith(nasAuthImageUrl)) {
      return `${nasAuthImageEndpoint}/${profileImageUrl.slice(nasAuthImageUrl.length)}${user ? `?user=${user}` : ''}`
    }

    return profileImageUrl
  }, [profileImageUrl, user])
)

export default useResolvedProfilePic
