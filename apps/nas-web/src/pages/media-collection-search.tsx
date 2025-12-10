import { Helmet } from '@dr.pogodin/react-helmet'
import {
  type ChangeEventHandler,
  useCallback,
  useMemo,
} from 'react'
import {
  Link,
  Navigate,
  useParams,
  useSearchParams,
} from 'react-router'
import SearchResults from '../components/media/search-results'
import NavbarBackdropFilter from '../components/navbar-backdrop-filter'
import { useTokenInfo } from '../hooks/use-token-info'

const searchInputId = 'media-search'

export default function MediaCollectionSearchPage() {
  const tokenInfo = useTokenInfo()
  const { module } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const app = useMemo(() => (
    tokenInfo.permissions
      .filter(({ applicationKey }) => applicationKey === 'nas-fs')
      .filter(({ name }) => !name.endsWith(':admin'))
      .map((perm) => ({ key: perm.name, name: perm.displayName }))
      .find((perm) => perm.key === module)
  ), [tokenInfo.permissions, module])
  const searchFilter = searchParams.get('q') || ''
  const shouldReplaceHistory = !!searchFilter

  const onSearchFilterChange: ChangeEventHandler<HTMLInputElement> = useCallback((e) => {
    setSearchParams({ q: e.target.value }, { replace: shouldReplaceHistory })
  }, [setSearchParams, shouldReplaceHistory])

  const onSearchFilterSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchParams((s) => ({ q: s.get('q') || '' }))
  }, [setSearchParams])

  if (!app || !module) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      <Helmet>
        <title>{`Search ${app.name}`}</title>
      </Helmet>

      <NavbarBackdropFilter />

      <div className="px-2 px-md-4 pb-3 padding-nav-bar">
        <h1>
          <Link to={`/m/${module}/`} className="text-decoration-none">{app.name}</Link>
        </h1>

        <form onSubmit={onSearchFilterSubmit}>
          <label htmlFor={searchInputId} className="visually-hidden form-label">
            Search Filter
          </label>
          <input
            type="search"
            id={searchInputId}
            placeholder="Search..."
            className="form-control mb-3"
            value={searchFilter}
            onChange={onSearchFilterChange}
          />
        </form>
        <SearchResults module={module} searchFilter={searchFilter} />
      </div>
    </>
  )
}
