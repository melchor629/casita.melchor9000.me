import {
  Navigate,
  createBrowserRouter,
  type LoaderFunction,
} from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { env } from '@/utils/config'
import { AppLoader } from '../components/loaders'
import AuthPage from './auth'
import ErrorBoundary from './error-boundary'
import Layout from './layout'

function doit<T extends React.ComponentType>(imp: () => Promise<{ default: T, loader?: LoaderFunction }>) {
  return async () => {
    const { default: Component, ...other } = await imp()
    return { Component, ...other }
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    hydrateFallbackElement: <AppLoader message="Loading application..." navbarMargin />,
    ErrorBoundary,
    children: [
      {
        path: '/',
        ErrorBoundary,
        lazy: doit(() => import('./home')),
      },
      {
        path: 'm',
        ErrorBoundary,
        children: [
          {
            index: true,
            element: <Navigate to="/" replace />,
          },
          {
            path: ':module',
            lazy: doit(() => import('./media-collection-home')),
          },
          {
            path: ':module/search',
            lazy: doit(() => import('./media-collection-search')),
          },
          {
            path: ':module/:itemId',
            lazy: doit(() => import('./media-collection-item')),
          },
        ],
      },
      {
        path: ':module',
        ErrorBoundary,
        lazy: doit(() => import('./module-path')),
        children: [
          {
            path: '*',
            lazy: doit(() => import('./module-path')),
          },
        ],
      },
      {
        path: 'auth',
        ErrorBoundary,
        element: <AuthPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: env.baseName,
})

const AppRoutes = () => (
  <RouterProvider
    router={router}
  />
)

export default AppRoutes
