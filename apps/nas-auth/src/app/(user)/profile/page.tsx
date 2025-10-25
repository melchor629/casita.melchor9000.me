import { notFound, type PageLoader } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { usePrefillGetUserProfilePictures } from '#actions/queries/get-user-profile-pictures.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import Profile from './profile'

type LoaderData = Readonly<{
  session: ActionReturnType<'get-session'>
  pictures: ActionReturnType<'get-user-profile-pictures'>
}>

export const loader: PageLoader<LoaderData> = async (context) => {
  const session = await runActionForLoader('get-session', context)
  return {
    session,
    pictures: session ? await runActionForLoader('get-user-profile-pictures', context) : [],
  }
}

export const metadata = {
  title: 'Edit Profile',
}

const EditProfilePage = ({ pictures, session }: LoaderData) => {
  usePrefillGetSession(session)
  usePrefillGetUserProfilePictures(pictures)

  if (session == null) {
    return notFound()
  }

  return <Profile />
}

export default EditProfilePage
