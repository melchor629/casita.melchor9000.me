import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { AppLoader } from '../components/loaders'
import NavBar from '../components/nav-bar'

const Layout = () => (
  <>
    <NavBar />
    <ScrollRestoration />

    <main className="flex min-h-screen w-full flex-col px-3">
      <Suspense fallback={<AppLoader message="Loading page..." />}>
        <Outlet />
      </Suspense>
    </main>
  </>
)

export default Layout
