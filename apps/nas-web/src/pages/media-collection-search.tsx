import { Helmet } from '@dr.pogodin/react-helmet'
import {
  type ChangeEventHandler,
  useCallback,
  useMemo,
} from 'react'
import {
  Navigate,
  useParams,
  useSearchParams,
} from 'react-router'
import ReactRouterLink from '@/components/core/react-router-link'
import { TextInput } from '@/components/form'
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

      <div className="px-2 md:px-4 pb-3 pt-navbar">
        <h2 className="text-h2 mb-3">
          <ReactRouterLink to={`/m/${module}/`}>{app.name}</ReactRouterLink>
        </h2>

        <form onSubmit={onSearchFilterSubmit}>
          <TextInput
            type="search"
            id={searchInputId}
            className="mb-4"
            size="large"
            placeholder="Search..."
            value={searchFilter}
            onChange={onSearchFilterChange}
          />
        </form>
        <SearchResults module={module} searchFilter={searchFilter} />
      </div>
    </>
  )
}
