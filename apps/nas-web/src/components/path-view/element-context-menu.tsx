import { type ReactElement, useMemo } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import usePermission from '@/hooks/use-permission'
import { ContextMenu } from '../context-menu'
import AndroidButton from './buttons/android-button'
import CreateButton from './buttons/create-button'
import DeleteThumbnailsButton from './buttons/delete-thumbnails-button'
import DownloadButton from './buttons/download-button'
import DownloadPlsButton from './buttons/download-pls-button'
import GenerateDownloadUrl from './buttons/generate-download-url'
import GenerateThumbnailsButton from './buttons/generate-thumbnails-button'
import IinaButton from './buttons/iina-button'
import SynchronizeButton from './buttons/synchronize-button'
import UploadButton from './buttons/upload-button'

interface ElementContextMenuProps {
  readonly buttonElement: HTMLElement | null
  readonly metadata: DirectoryMetadata | FileMetadata
  readonly module: string
  readonly show: boolean
  readonly shouldClose?: () => void
}

function ElementContextMenu({
  buttonElement,
  metadata,
  module,
  shouldClose,
  show,
}: ElementContextMenuProps) {
  const modulePermission = usePermission(module)!
  const moduleAdminPermission = usePermission(`${module}:admin`)
  const items = useMemo(() => {
    const isMedia = metadata.mime?.mime.startsWith('audio') || metadata.mime?.mime.startsWith('video')
    const isImage = metadata.mime?.mime.startsWith('image')
    const isMac = navigator.platform.includes('Mac')
    const isAndroid = navigator.userAgent.includes('Android ')
    const isRootPath = metadata.path === '/'
    const containsMediaForPlaylist = metadata?.type === 'dir'
      ? metadata.contents.find((e) => (
        e.type === 'file'
          && (e.mime?.mime.startsWith('audio') || e.mime?.mime.startsWith('video'))
          && !e.hidden
      ))
      : metadata?.mime?.mime.startsWith('audio') || metadata?.mime?.mime.startsWith('video')

    const elements: Array<{ key: string, content: ReactElement }> = []

    if (metadata.type === 'file') {
      elements.push({
        key: 'download',
        content: <DownloadButton module={module} metadata={metadata} />,
      })
      elements.push({
        key: 'generate-url',
        content: <GenerateDownloadUrl module={module} metadata={[metadata]} />,
      })

      if (containsMediaForPlaylist) {
        elements.push({
          key: 'playlist',
          content: <DownloadPlsButton module={module} metadata={metadata} />,
        })
      }

      if (isMedia && isMac) {
        elements.push({
          key: 'iina',
          content: <IinaButton module={module} metadata={metadata} />,
        })
      }
      if ((isMedia || isImage) && isAndroid) {
        elements.push({
          key: 'android',
          content: <AndroidButton module={module} metadata={metadata} />,
        })
      }
    }

    if (metadata.type === 'dir') {
      elements.push({
        key: 'download',
        content: <DownloadButton module={module} metadata={metadata} disabled={isRootPath} />,
      })
      elements.push({
        key: 'generate-url',
        content: <GenerateDownloadUrl
          module={module}
          metadata={[metadata]}
          disabled={isRootPath}
                 />,
      })

      if (containsMediaForPlaylist) {
        elements.push({
          key: 'playlist',
          content: <DownloadPlsButton module={module} metadata={metadata} />,
        })
      }

      if (modulePermission.write) {
        elements.push({
          key: 'upload',
          content: <UploadButton module={module} metadata={metadata} />,
        })
        elements.push({
          key: 'create',
          content: <CreateButton module={module} metadata={metadata} />,
        })
      }
    }

    if (moduleAdminPermission?.write && moduleAdminPermission?.delete) {
      elements.push({
        key: 'space-1',
        content: <div style={{ height: '0.75rem' }} />,
      })

      elements.push({
        key: 'sync',
        content: <SynchronizeButton module={module} entries={[metadata]} />,
      })
      elements.push({
        key: 'generate-thumbnails',
        content: <GenerateThumbnailsButton module={module} selectedElements={[metadata]} />,
      })
      elements.push({
        key: 'delete-thumbnails',
        content: <DeleteThumbnailsButton
          key="delete-thumbnails"
          module={module}
          entries={[metadata]}
                 />,
      })
    }

    return elements
  }, [metadata, module, modulePermission, moduleAdminPermission])

  return (
    <ContextMenu
      items={items}
      referenceElement={buttonElement}
      show={show}
      shouldClose={shouldClose}
    />
  )
}

export default ElementContextMenu
