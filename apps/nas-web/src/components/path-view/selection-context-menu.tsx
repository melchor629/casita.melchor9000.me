import { flip, offset, type VirtualElement } from '@floating-ui/react'
import { MenuItemSeparator, PopoverMenu } from '@melchor629/ui'
import { useMemo, type ReactElement } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import usePermission from '@/hooks/use-permission'
import AndroidButton from './buttons/android-button'
import DeleteButton from './buttons/delete-button'
import DeleteThumbnailsButton from './buttons/delete-thumbnails-button'
import DownloadButton from './buttons/download-button'
import DownloadPlsButton from './buttons/download-pls-button'
import GenerateDownloadUrl from './buttons/generate-download-url'
import GenerateThumbnailsButton from './buttons/generate-thumbnails-button'
import IinaButton from './buttons/iina-button'
import RenameButton from './buttons/rename-button'
import SynchronizeButton from './buttons/synchronize-button'

interface SelectionContextMenuProps {
  readonly buttonElement: HTMLElement | VirtualElement | null
  readonly module: string
  readonly selectedElements: Array<DirectoryMetadata | FileMetadata>
  readonly show: boolean
  readonly placeStart?: boolean
  readonly shouldClose?: () => void
}

function SelectionContextMenu({
  buttonElement,
  module,
  placeStart,
  selectedElements,
  shouldClose,
  show,
}: SelectionContextMenuProps) {
  const modulePermission = usePermission(module)!
  const moduleAdminPermission = usePermission(`${module}:admin`)
  const items = useMemo(() => {
    const buttons: Array<ReactElement> = []

    buttons.push(<DownloadButton key="download" module={module} metadata={selectedElements} />)

    buttons.push(<GenerateDownloadUrl key="generate-url" module={module} metadata={selectedElements} />)

    const containsMediaForPlaylist = selectedElements.find((e) => (
      e.type === 'file'
        && !e.hidden
        && (e.mime?.mime.startsWith('audio') || e.mime?.mime.startsWith('video'))
    ))
    buttons.push(
      <DownloadPlsButton
        key="playlist"
        module={module}
        metadata={selectedElements}
        disabled={!containsMediaForPlaylist}
      />,
    )

    if (selectedElements.length === 1) {
      const [metadata] = selectedElements
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
          metadata={selectedElements[0]}
          disabled={selectedElements.length !== 1}
        />,
      )
    }

    if (modulePermission.delete) {
      buttons.push(<DeleteButton key="delete" module={module} entries={selectedElements} />)
    }

    if (moduleAdminPermission?.write && moduleAdminPermission?.delete) {
      buttons.push(<MenuItemSeparator key="space-1" />)

      buttons.push(<SynchronizeButton key="sync" module={module} entries={selectedElements} />)

      buttons.push(
        <GenerateThumbnailsButton
          key="generate-thumbnails"
          module={module}
          selectedElements={selectedElements}
        />,
      )

      buttons.push(
        <DeleteThumbnailsButton
          key="delete-thumbnails"
          module={module}
          entries={selectedElements}
        />,
      )
    }

    return buttons
  }, [module, selectedElements, modulePermission, moduleAdminPermission])

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

export default SelectionContextMenu
