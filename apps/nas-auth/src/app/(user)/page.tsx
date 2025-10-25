import type { Metadata, PageLoader } from '@melchor629/nice-ssr'
import { usePrefillGetSession } from '#actions/queries/get-session.ts'
import { runActionForLoader, type ActionReturnType } from '#actions/server/index.ts'
import Home from './home'

type LoaderData = Readonly<{ session: ActionReturnType<'get-session'> }>

export const loader: PageLoader<LoaderData> = async (context) => {
  return {
    session: await runActionForLoader('get-session', context),
  }
}

export const metadata = (data: LoaderData): Metadata => {
  return {
    title: data.session ? 'Your Profile' : 'Sign In',
  }
}

const HomePage = ({ session }: LoaderData) => {
  usePrefillGetSession(session)

  return <Home />
}

export default HomePage
