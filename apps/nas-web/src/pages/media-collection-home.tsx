import { Helmet } from '@dr.pogodin/react-helmet'
import { CircularProgress } from '@melchor629/ui'
import { Folder, Search } from '@melchor629/ui/icons'
import ReactRouterButton from '@melchor629/ui/ReactRouterButton'
import { useMemo } from 'react'
import { type LoaderFunction, Navigate, useParams } from 'react-router'
import ItemsGrid from '../components/media/items-grid'
import LibraryTypeIcon from '../components/media/library-type-icon'
import {
  prefetchMediaLibraryChildren,
  useMediaLibraryChildren,
} from '../hooks/api/use-media-library-children'
import { useTokenInfo } from '../hooks/use-token-info'

export const loader: LoaderFunction = async ({ params: { module } }) => {
  await prefetchMediaLibraryChildren(module)
}

export default function MediaCollectionHomePage() {
  const tokenInfo = useTokenInfo()
  const { module } = useParams()
  const app = useMemo(
    () =>
      tokenInfo.permissions
        .filter(({ applicationKey }) => applicationKey === 'nas-fs')
        .filter(({ name }) => !name.endsWith(':admin'))
        .map((perm) => ({ key: perm.name, name: perm.displayName }))
        .find((perm) => perm.key === module),
    [tokenInfo.permissions, module],
  )
  const { data, isLoading } = useMediaLibraryChildren(module)

  if (!app || !module) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  const type = data?.libraryType || null
  const items = data?.items
  return (
    <>
      <Helmet>
        <title>{app.name}</title>
      </Helmet>

      <div className="pt-navbar flex h-dvh flex-col">
        <div className="mb-4 flex justify-between">
          <h2 className="text-h2">
            <LibraryTypeIcon
              type={type}
              className="text-h1 align-middle"
            />
            <span className="align-middle select-none">
              &nbsp;
              {app.name}
            </span>
          </h2>

          <div>
            <ReactRouterButton
              to={`/m/${module}/search`}
              className="mr-1"
              size="large"
            >
              <Search className="text-h1" />
            </ReactRouterButton>
            <ReactRouterButton
              to={`/${module}/`}
              size="large"
            >
              <Folder className="text-h1" />
            </ReactRouterButton>
          </div>
        </div>

        {isLoading && (
          <div className="flex grow items-center justify-center">
            <CircularProgress size="large" />
          </div>
        )}

        {!isLoading && items && type && (
          <div className="relative grow">
            <ItemsGrid
              libraryType={type}
              items={items}
              module={module}
            />
          </div>
        )}

        {!isLoading && (!items || !type) && (
          <div className="flex grow items-center justify-center">
            This library does not contain any media.
          </div>
        )}
      </div>
    </>
  )
}
