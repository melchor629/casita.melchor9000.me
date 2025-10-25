'use client'

import { useGetSession } from '#actions/queries/get-session.ts'
import { Profile, StartLogin } from '#components/interactions/index.ts'

const Home = () => {
  const { data } = useGetSession()
  const { accountId, permissions, user } = data || {}
  const hasAdmin = (permissions?.length ?? 0) > 0

  return accountId && user ? <Profile user={user} role={hasAdmin ? 'admin' : 'user'} /> : <StartLogin />
}

export default Home
