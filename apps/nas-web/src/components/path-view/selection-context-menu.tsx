import type { VirtualElement } from '@floating-ui/core'
import { type ReactElement, useMemo } from 'react'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import usePermission from '@/hooks/use-permission'
import { ContextMenu } from '../context-menu'
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
    const buttons: Array<{ key: string, content: ReactElement }> = []

    buttons.push({
      key: 'download',
      content: <DownloadButton
        module={module}
        metadata={selectedElements}
               />,
    })

    buttons.push({
      key: 'generate-url',
      content: <GenerateDownloadUrl
        module={module}
        metadata={selectedElements}
        disabled={selectedElements.length === 0}
               />,
    })

    const containsMediaForPlaylist = selectedElements.find((e) => (
      e.type === 'file'
        && !e.hidden
        && (e.mime?.mime.startsWith('audio') || e.mime?.mime.startsWith('video'))
    ))
    buttons.push({
      key: 'playlist',
      content: <DownloadPlsButton
        module={module}
        metadata={selectedElements}
        disabled={!containsMediaForPlaylist}
               />,
    })

    if (selectedElements.length === 1) {
      const [metadata] = selectedElements
      if (metadata.type === 'file') {
        const { mime } = metadata.mime ?? {}
        const isMedia = mime?.startsWith('audio') || mime?.startsWith('video')
        const isImage = mime?.startsWith('image')
        const isMac = navigator.platform.includes('Mac')
        const isAndroid = navigator.userAgent.includes('Android ')

        if (isMedia && isMac) {
          buttons.push({
            key: 'iina',
            content: <IinaButton module={module} metadata={metadata} />,
          })
        }
        if ((isMedia || isImage) && isAndroid) {
          buttons.push({
            key: 'android',
            content: <AndroidButton module={module} metadata={metadata} />,
          })
        }
      }
    }

    if (modulePermission.write) {
      buttons.push({
        key: 'rename',
        content: <RenameButton
          key="rename"
          module={module}
          metadata={selectedElements[0]}
          disabled={selectedElements.length !== 1}
                 />,
      })
    }

    if (modulePermission.delete) {
      buttons.push({
        key: 'delete',
        content: <DeleteButton module={module} entries={selectedElements} />,
      })
    }

    if (moduleAdminPermission?.write && moduleAdminPermission?.delete) {
      buttons.push({
        key: 'space-1',
        content: <div style={{ height: '0.75rem' }} />,
      })

      buttons.push({
        key: 'sync',
        content: <SynchronizeButton module={module} entries={selectedElements} />,
      })

      buttons.push({
        key: 'generate-thumbnails',
        content: <GenerateThumbnailsButton
          key="generate-thumbnails"
          module={module}
          selectedElements={selectedElements}
                 />,
      })

      buttons.push({
        key: 'delete-thumbnails',
        content: <DeleteThumbnailsButton
          key="delete-thumbnails"
          module={module}
          entries={selectedElements}
                 />,
      })
    }

    return buttons
  }, [module, selectedElements, modulePermission, moduleAdminPermission])

  return (
    <ContextMenu
      items={items}
      referenceElement={buttonElement}
      show={show}
      shouldClose={shouldClose}
      placement={placeStart ? 'bottom-start' : 'bottom'}
    />
  )
}

export default SelectionContextMenu
