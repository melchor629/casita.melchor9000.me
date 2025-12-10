import { Suspense } from 'react'
import { Outlet, ScrollRestoration } from 'react-router'
import { AppLoader } from '../components/loaders'
import NavBar from '../components/nav-bar'

const Layout = () => (
  <>
    <NavBar />
    <ScrollRestoration />

    <main
      className="container-fluid d-flex flex-column"
      style={{ minHeight: '100vh' }}
    >
      <Suspense fallback={<AppLoader message="Loading page..." />}>
        <Outlet />
      </Suspense>
    </main>
  </>
)

export default Layout
