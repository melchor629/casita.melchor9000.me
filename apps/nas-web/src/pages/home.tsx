import { Helmet } from '@dr.pogodin/react-helmet'
import { CircularProgress } from '@melchor629/ui'
import { Suspense, useMemo } from 'react'
import NavbarBackdropFilter from '../components/navbar-backdrop-filter'
import RecentMedia from '../components/recent-media'
import { useTokenInfo } from '../hooks/use-token-info'

export default function HomePage() {
  const tokenInfo = useTokenInfo()
  const apps = useMemo(() => {
    const filteredApps = tokenInfo.permissions
      .filter(({ applicationKey }) => applicationKey === 'nas-fs')
      .filter(({ name }) => !name.endsWith(':admin'))
      .map((perm) => ({ key: perm.name, name: perm.displayName }))
      .toSorted((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))

    return filteredApps
  }, [tokenInfo.permissions])

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <NavbarBackdropFilter />

      <div className="mt-navbar">
        <Suspense fallback={<div className="text-center my-2"><CircularProgress show size="large" /></div>}>
          {apps.map(({ key, name }) => <RecentMedia key={key} name={name} module={key} />)}
        </Suspense>
      </div>
    </>
  )
}
