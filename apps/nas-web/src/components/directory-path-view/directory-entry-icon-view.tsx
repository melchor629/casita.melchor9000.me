import { useEffect, useState } from 'react'
import { styled } from 'styled-components'
import { openFileSystemEvents } from '@/api/fs'
import type { DirectoryMetadata } from '@/api/fs/directory'
import type { FileMetadata } from '@/api/fs/file'
import useApiClient from '@/hooks/use-api-client'
import { useSettings } from '@/hooks/use-settings'
import { hasAvifSupport, hasWebpSupport } from '@/utils/image-support'
import * as thumbnailManager from '@/utils/thumbnail-manager'
import {
  File,
  FileAudio,
  FileBinary,
  FileCode,
  FileImage,
  FileVideo,
  FileZipper,
  Folder,
} from '../icons'

interface DirectoryEntryIconViewProps {
  readonly entry: DirectoryMetadata | FileMetadata
  readonly module: string
  readonly size: number
}

const archiveTypes = [
  'application/zip',
  'application/x-rar-compressed',
  'application/x-tar',
  'application/gzip',
  'application/x-xz',
]

const ThumbnailIconContainer = styled.div<{ size: number }>`
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  padding: ${({ size }) => (size <= 64 ? 0 : 0.25)}rem;
  margin-right: ${({ size }) => (size <= 64 ? 5 : 0)}px;

  > svg {
    && { display: block; }
    display: block;
    width: calc(${({ size }) => size}px - ${({ size }) => (size <= 64 ? 0 : 0.5)}rem);
    height: 100%;
  }
`

const ThumbnailIcon = styled.div<{ size: number, src: string }>`
  width: 100%;
  padding-bottom: 100%;
  border-radius: ${({ size }) => (size <= 64 ? '2px' : '8px')};
  background-image: url(${({ src }) => src});
  background-size: contain;
  background-position: center;
`

function DirectoryEntryIconView({ entry, module, size }: DirectoryEntryIconViewProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const settings = useSettings()
  const apiClient = useApiClient()

  useEffect(() => {
    if (entry.type !== 'file' || !settings.showThumbnails) {
      return () => undefined
    }

    const ac = new AbortController()
    const fse = openFileSystemEvents(module, apiClient)
    const listener = ({ path }: { path: string }) => {
      if (path && path !== entry.path) {
        return
      }

      // @ts-expect-error not standard yet
      const connection = (navigator.connection
        // @ts-expect-error not standard yet
        || navigator.mozConnection
        // @ts-expect-error not standard yet
        || navigator.webkitConnection) as { type: string } | undefined
      const saveDataMode = ['bluetooth', 'cellular'].includes(connection?.type ?? 'unknown')
      const format = (hasAvifSupport() && 'avif')
        || (hasWebpSupport() && 'webp')
        || (saveDataMode && 'jpg')
        || 'png'

      thumbnailManager.getThumbnail(
        apiClient,
        module,
        entry,
        { format, size: size < 64 ? 'sm' : 'lg' },
        ac.signal,
        // force ignore cache if the function is called from the fs-events
        !!path,
      )
        .then((pair) => (pair ? setBlobUrl(pair[0]) : setBlobUrl(null)))
        .catch(() => !ac.signal.aborted && setBlobUrl(null))
    }
    fse.on('thumbnail', listener)

    listener({ path: '' })

    return () => {
      fse.off('thumbnail', listener)
      ac.abort()
    }
  }, [entry, size, module, settings.showThumbnails, apiClient])

  let icon
  if (blobUrl !== null) {
    icon = <ThumbnailIcon src={blobUrl} size={size} />
  } else {
    const { mime, type } = entry
    if (type === 'dir') {
      icon = <Folder />
    } else if (mime === undefined) {
      icon = <File />
    } else if (mime.isText) {
      icon = <FileCode />
    } else if (mime.mime.startsWith('audio')) {
      icon = <FileAudio />
    } else if (mime.mime.startsWith('video')) {
      icon = <FileVideo />
    } else if (mime.mime.startsWith('image')) {
      icon = <FileImage />
    } else if (archiveTypes.includes(mime.mime)) {
      icon = <FileZipper />
    } else {
      icon = <FileBinary />
    }
  }

  return <ThumbnailIconContainer size={size}>{icon}</ThumbnailIconContainer>
}

export default DirectoryEntryIconView
