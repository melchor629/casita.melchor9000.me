import { Helmet } from '@dr.pogodin/react-helmet'
import { Suspense, useMemo } from 'react'
import { Spinner } from '../components/loaders'
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

      <div style={{ marginTop: 'var(--me-navbar-height)' }}>
        <Suspense fallback={<div className="text-center my-2"><Spinner show size="lg" /></div>}>
          {apps.map(({ key, name }) => <RecentMedia key={key} name={name} module={key} />)}
        </Suspense>
      </div>
    </>
  )
}
