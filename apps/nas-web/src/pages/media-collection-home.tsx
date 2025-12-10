import { Helmet } from '@dr.pogodin/react-helmet'
import { useMemo } from 'react'
import { Link, type LoaderFunction, Navigate, useParams } from 'react-router'
import { Folder, Search } from '../components/icons'
import { Spinner } from '../components/loaders'
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

      <div className="d-flex flex-column full-height padding-nav-bar">
        <div className="d-flex justify-content-between mb-2">
          <h1>
            <LibraryTypeIcon type={type} style={{ height: 'calc(1.375rem + 1.5vw)' }} />
            <span style={{ verticalAlign: 'middle' }}>
              &nbsp;
              {app.name}
            </span>
          </h1>

          <div>
            <Link to={`/m/${module}/search`} className="btn btn-secondary-outline btn-link ml-1">
              <Search style={{ height: 'calc(1.375rem + 1.5vw)' }} />
            </Link>
            <Link to={`/${module}/`} className="btn btn-secondary-outline btn-link">
              <Folder style={{ height: 'calc(1.375rem + 1.5vw)' }} />
            </Link>
          </div>
        </div>

        {isLoading && (
          <div className="d-flex align-items-center justify-content-center flex-grow-1">
            <Spinner size="lg" />
          </div>
        )}

        {!isLoading && items && type && (
          <div className="flex-grow-1 position-relative">
            <ItemsGrid libraryType={type} items={items} module={module} />
          </div>
        )}

        {!isLoading && (!items || !type) && (
          <div className="d-flex align-items-center justify-content-center flex-grow-1">
            This library does not contain any media.
          </div>
        )}
      </div>
    </>
  )
}
