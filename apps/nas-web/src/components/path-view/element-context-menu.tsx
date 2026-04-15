import { flip, offset, type VirtualElement } from '@floating-ui/react'
import { MenuItemSeparator } from '@melchor629/ui'
import PopoverMenu from '@melchor629/ui/PopoverMenu'
import { useMemo, type ReactElement } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import usePermission from '@/hooks/use-permission'
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
  readonly buttonElement: HTMLElement | VirtualElement | null
  readonly metadata: DirectoryMetadata | FileMetadata
  readonly module: string
  readonly show: boolean
  readonly placeStart?: boolean
  readonly shouldClose?: () => void
}

function ElementContextMenu({
  buttonElement,
  metadata,
  module,
  placeStart,
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

    const elements: Array<ReactElement> = []

    if (metadata.type === 'file') {
      elements.push(<DownloadButton key="download" module={module} metadata={metadata} />)
      elements.push(<GenerateDownloadUrl key="generate-url" module={module} metadata={[metadata]} />)

      if (containsMediaForPlaylist) {
        elements.push(<DownloadPlsButton key="playlist" module={module} metadata={metadata} />)
      }

      if (isMedia && isMac) {
        elements.push(<IinaButton key="iina" module={module} metadata={metadata} />)
      }
      if ((isMedia || isImage) && isAndroid) {
        elements.push(<AndroidButton key="android" module={module} metadata={metadata} />)
      }
    }

    if (metadata.type === 'dir') {
      elements.push(
        <DownloadButton
          key="download"
          module={module}
          metadata={metadata}
          disabled={isRootPath}
        />,
      )
      elements.push(
        <GenerateDownloadUrl
          key="generate-url"
          module={module}
          metadata={[metadata]}
          disabled={isRootPath}
        />,
      )

      if (containsMediaForPlaylist) {
        elements.push(<DownloadPlsButton key="playlist" module={module} metadata={metadata} />)
      }

      if (modulePermission.write) {
        elements.push(<UploadButton key="upload" module={module} metadata={metadata} />)
        elements.push(<CreateButton key="create" module={module} metadata={metadata} />)
      }
    }

    if (moduleAdminPermission?.write && moduleAdminPermission?.delete) {
      elements.push(<MenuItemSeparator key="space-1" />)

      elements.push(<SynchronizeButton key="sync" module={module} entries={[metadata]} />)
      elements.push(
        <GenerateThumbnailsButton
          key="generate-thumbnails"
          module={module}
          selectedElements={[metadata]}
        />,
      )
      elements.push(
        <DeleteThumbnailsButton
          key="delete-thumbnails"
          module={module}
          entries={[metadata]}
        />,
      )
    }

    return elements
  }, [metadata, module, modulePermission, moduleAdminPermission])

  return (
    <PopoverMenu
      referenceElement={buttonElement}
      open={show}
      onClose={shouldClose}
      portal
      placement={placeStart ? 'bottom-start' : 'bottom'}
      middleware={placeStart ? [flip()] : [offset(8)]}
    >
      {items}
    </PopoverMenu>
  )
}

export default ElementContextMenu
