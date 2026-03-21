import { Helmet } from '@dr.pogodin/react-helmet'
import { Text } from '@melchor629/ui'
import ReactRouterLink from '@melchor629/ui/ReactRouterLink'
import { useEffect, useState } from 'react'
import {
  type LoaderFunction,
  Navigate,
  useLocation,
  useParams,
} from 'react-router'
import type { DirectoryMetadata } from '../api/fs/directory'
import type { FileMetadata } from '../api/fs/file'
import DirectoryPathView from '../components/directory-path-view'
import FilePathView from '../components/file-path-view'
import { AppLoader } from '../components/loaders'
import Header from '../components/path-view'
import ScrollToTopWhen from '../components/scroll-to-top-when'
import { prefetchStorageMetadata } from '../hooks/api/use-storage-metadata'
import useMetadata from '../hooks/use-metadata'
import { useSettings } from '../hooks/use-settings'
import * as Path from '../utils/path'

export const loader: LoaderFunction = async ({ params: { module }, request }) => {
  const path = decodeURIComponent(new URL(request.url).pathname.substring(module!.length + 2))
  await prefetchStorageMetadata(module!, path)
}

export default function ModulePathPage() {
  const module = useParams<'module'>().module!
  const { pathname } = useLocation()
  const path = decodeURIComponent(pathname?.substring(`/${module}/`.length) || '')
  const parentUrl = Path.dirname(Path.join('/', module, path))
  const { hidden } = useSettings()
  const { error, loading: loadingMetadata, metadata } = useMetadata(module, path)
  const [selectedElements, setSelectedElements] = useState<(DirectoryMetadata | FileMetadata)[]>([])

  useEffect(() => {
    const elem = window.document.body.querySelector<HTMLDivElement>('#root > div > div > div')!
    const deselect = (e: MouseEvent) => {
      if (!['BUTTON', 'A'].includes((e.target! as HTMLElement).tagName)) {
        setSelectedElements([])
      }
    }
    const keyDownDeselect = (e: KeyboardEvent) => {
      if (e.target === window.document.body && e.key === 'Escape') {
        setSelectedElements([])
      }
    }
    elem.addEventListener('click', deselect)
    window.addEventListener('keydown', keyDownDeselect)

    return () => {
      elem.removeEventListener('click', deselect)
      window.removeEventListener('keydown', keyDownDeselect)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedElements([])
  }, [path])

  useEffect(() => {
    if (metadata && metadata.type === 'dir') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedElements((s) => s.filter((e) => metadata.contents.find((c) => c.path === e.path)))
    }
  }, [metadata])

  if (metadata == null && loadingMetadata) {
    return (
      <div className="mt-navbar">
        <Helmet><title>Loading...</title></Helmet>
        <AppLoader message="Loading information..." />
      </div>
    )
  }

  if (error != null) {
    const fullPath = Path.join('/', module, path)
    return (
      <div className="sticky top-0 mt-navbar px-6 py-4">
        <Text size="h2">
          Could not load&nbsp;
          {fullPath}
        </Text>
        <div>
          {'Go to '}
          <ReactRouterLink to={Path.dirname(fullPath)}>parent folder</ReactRouterLink>
          {' or go to '}
          <ReactRouterLink to={Path.join('/', module)}>root folder</ReactRouterLink>
          .
        </div>
        <pre className="p-6 text-text-secondary">{JSON.stringify(error, undefined, 2)}</pre>
      </div>
    )
  }

  if (metadata == null) {
    // This case means that an unknown error happened, or the folder/file was simply removed
    return <Navigate to={parentUrl} />
  }

  return (
    <>
      <Helmet>
        <title>{metadata.path === '/' ? module : Path.basename(metadata.path) || module}</title>
      </Helmet>

      <ScrollToTopWhen deps={metadata.path} />

      <Header
        loading={loadingMetadata}
        metadata={metadata}
        module={module}
        onClick={() => setSelectedElements([])}
        selectedElements={selectedElements}
      />

      {metadata.type === 'dir'
        ? (
          <DirectoryPathView
            module={module}
            metadata={metadata}
            hidden={hidden}
            selectedElements={selectedElements}
            setSelectedElements={setSelectedElements}
          />
          )
        : (
          <FilePathView
            metadata={metadata}
            module={module}
          />
          )}
    </>
  )
}
