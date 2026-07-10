import { flip, offset, type VirtualElement } from '@floating-ui/react'
import { MenuItemSeparator } from '@melchor629/ui'
import PopoverMenu from '@melchor629/ui/PopoverMenu'
import { useMemo, type ReactElement } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import type { TokenPermission } from '@/api/token/token-info'
import usePermission from '@/hooks/use-permission'
import AndroidButton from './buttons/android-button'
import CreateButton from './buttons/create-button'
import DeleteButton from './buttons/delete-button'
import DeleteThumbnailsButton from './buttons/delete-thumbnails-button'
import DownloadButton from './buttons/download-button'
import DownloadPlsButton from './buttons/download-pls-button'
import GenerateDownloadUrl from './buttons/generate-download-url'
import GenerateThumbnailsButton from './buttons/generate-thumbnails-button'
import IinaButton from './buttons/iina-button'
import RenameButton from './buttons/rename-button'
import SynchronizeButton from './buttons/synchronize-button'
import UploadButton from './buttons/upload-button'

type EntriesContextMenuProps = Readonly<{
  referenceElement: HTMLElement | VirtualElement | null
  entries: DirectoryMetadata | FileMetadata | Array<DirectoryMetadata | FileMetadata>
  module: string
  show: boolean
  placeStart?: boolean
  shouldClose?: () => void
  onClosed?: () => void
}>

export default function EntriesContextMenu({
  entries,
  module,
  onClosed,
  placeStart,
  referenceElement,
  shouldClose,
  show,
}: EntriesContextMenuProps) {
  const modulePermission = usePermission(module)!
  const moduleAdminPermission = usePermission(`${module}:admin`)
  const items = useMemo(
    () => createButtonItems(entries, module, modulePermission, moduleAdminPermission),
    [entries, module, modulePermission, moduleAdminPermission],
  )

  return (
    <PopoverMenu
      referenceElement={referenceElement}
      open={show}
      onClose={shouldClose}
      onClosed={onClosed}
      portal
      placement={placeStart ? 'bottom-start' : 'bottom'}
      middleware={placeStart ? [flip()] : [offset(8)]}
    >
      {items}
    </PopoverMenu>
  )
}

function createMultipleButtonItems(
  entries: (DirectoryMetadata | FileMetadata)[],
  module: string,
  modulePermission: TokenPermission,
  moduleAdminPermission: TokenPermission | undefined,
) {
  const buttons: Array<ReactElement> = []

  buttons.push(<DownloadButton key="download" module={module} metadata={entries} />)

  buttons.push(<GenerateDownloadUrl key="generate-url" module={module} metadata={entries} />)

  const containsMediaForPlaylist = entries.find((e) => (
    e.type === 'file'
    && !e.hidden
    && (e.mime?.mime.startsWith('audio') || e.mime?.mime.startsWith('video'))
  ))
  buttons.push(
    <DownloadPlsButton
      key="playlist"
      module={module}
      metadata={entries}
      disabled={!containsMediaForPlaylist}
    />,
  )

  if (entries.length === 1) {
    const [metadata] = entries
    if (metadata.type === 'file') {
      const { mime } = metadata.mime ?? {}
      const isMedia = mime?.startsWith('audio') || mime?.startsWith('video')
      const isImage = mime?.startsWith('image')
      const isMac = navigator.platform.includes('Mac')
      const isAndroid = navigator.userAgent.includes('Android ')

      if (isMedia && isMac) {
        buttons.push(<IinaButton key="iina" module={module} metadata={metadata} />)
      }
      if ((isMedia || isImage) && isAndroid) {
        buttons.push(<AndroidButton key="android" module={module} metadata={metadata} />)
      }
    }
  }

  if (modulePermission.write) {
    buttons.push(
      <RenameButton
        key="rename"
        module={module}
        metadata={entries[0]}
        disabled={entries.length !== 1}
      />,
    )
  }

  if (modulePermission.delete) {
    buttons.push(<DeleteButton key="delete" module={module} entries={entries} />)
  }

  if (moduleAdminPermission?.write && moduleAdminPermission?.delete) {
    buttons.push(<MenuItemSeparator key="space-1" />)

    buttons.push(<SynchronizeButton key="sync" module={module} entries={entries} />)

    buttons.push(
      <GenerateThumbnailsButton
        key="generate-thumbnails"
        module={module}
        selectedElements={entries}
      />,
    )

    buttons.push(
      <DeleteThumbnailsButton
        key="delete-thumbnails"
        module={module}
        entries={entries}
      />,
    )
  }

  return buttons
}

function createUniqueButtonItems(
  metadata: DirectoryMetadata | FileMetadata,
  module: string,
  modulePermission: TokenPermission,
  moduleAdminPermission: TokenPermission | undefined,
) {
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
}

function createButtonItems(
  entries: DirectoryMetadata | FileMetadata | (DirectoryMetadata | FileMetadata)[],
  module: string,
  modulePermission: TokenPermission,
  moduleAdminPermission: TokenPermission | undefined,
) {
  if (Array.isArray(entries)) {
    return createMultipleButtonItems(entries, module, modulePermission, moduleAdminPermission)
  }

  return createUniqueButtonItems(entries, module, modulePermission, moduleAdminPermission)
}
