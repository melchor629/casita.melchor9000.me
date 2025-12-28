import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { AppLoader } from '../components/loaders'
import NavBar from '../components/nav-bar'

const Layout = () => (
  <>
    <NavBar />
    <ScrollRestoration />

    <main className="w-full min-h-screen px-3 flex flex-col">
      <Suspense fallback={<AppLoader message="Loading page..." />}>
        <Outlet />
      </Suspense>
    </main>
  </>
)

export default Layout
