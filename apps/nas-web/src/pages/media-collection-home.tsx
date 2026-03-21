import { Helmet } from '@dr.pogodin/react-helmet'
import { CircularProgress } from '@melchor629/ui'
import ReactRouterButton from '@melchor629/ui/ReactRouterButton'
import { Folder, Search } from '@melchor629/ui/icons'
import { useMemo } from 'react'
import { type LoaderFunction, Navigate, useParams } from 'react-router'
import ItemsGrid from '../components/media/items-grid'
import LibraryTypeIcon from '../components/media/library-type-icon'
import { prefetchMediaLibraryChildren, useMediaLibraryChildren } from '../hooks/api/use-media-library-children'
import { useTokenInfo } from '../hooks/use-token-info'

export const loader: LoaderFunction = async ({ params: { module } }) => {
  await prefetchMediaLibraryChildren(module)
}

export default function MediaCollectionHomePage() {
  const tokenInfo = useTokenInfo()
  const { module } = useParams()
  const app = useMemo(() => (
    tokenInfo.permissions
      .filter(({ applicationKey }) => applicationKey === 'nas-fs')
      .filter(({ name }) => !name.endsWith(':admin'))
      .map((perm) => ({ key: perm.name, name: perm.displayName }))
      .find((perm) => perm.key === module)
  ), [tokenInfo.permissions, module])
  const { data, isLoading } = useMediaLibraryChildren(module)

  if (!app || !module) {
    return <Navigate to="/" replace />
  }

  const type = data?.libraryType || null
  const items = data?.items
  return (
    <>
      <Helmet>
        <title>{app.name}</title>
      </Helmet>

      <div className="flex flex-col h-dvh pt-navbar">
        <div className="flex justify-between mb-4">
          <h2 className="text-h2">
            <LibraryTypeIcon type={type} className="text-h1 align-middle" />
            <span className="select-none align-middle">
              &nbsp;
              {app.name}
            </span>
          </h2>

          <div>
            <ReactRouterButton to={`/m/${module}/search`} className="mr-1" size="large">
              <Search className="text-h1" />
            </ReactRouterButton>
            <ReactRouterButton to={`/${module}/`} size="large">
              <Folder className="text-h1" />
            </ReactRouterButton>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center grow">
            <CircularProgress size="large" />
          </div>
        )}

        {!isLoading && items && type && (
          <div className="grow relative">
            <ItemsGrid libraryType={type} items={items} module={module} />
          </div>
        )}

        {!isLoading && (!items || !type) && (
          <div className="flex items-center justify-center grow">
            This library does not contain any media.
          </div>
        )}
      </div>
    </>
  )
}
