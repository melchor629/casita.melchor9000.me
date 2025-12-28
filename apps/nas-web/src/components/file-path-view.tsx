import { useEffect, useState } from 'react'
import { getDownloadUrl } from '../api/fs'
import type { FileMetadata } from '../api/fs/file'
import useApiClient from '../hooks/use-api-client'
import * as path from '../utils/path'
import AudioTagsView from './audio-tags-view'
import CodeHighlightView from './code-highlight-view'
import ExifView from './exif-view'
import ImagesFilePathView from './images-file-path-view'
import MediaInfoView from './mediainfo-view'
import PdfView from './pdf-view'

interface FilePathViewProps {
  readonly metadata: FileMetadata
  readonly module: string
}

export default function FilePathView({ metadata, module }: FilePathViewProps) {
  const apiClient = useApiClient()
  const [downloadUrl, setDownloadUrl] = useState('')

  useEffect(() => {
    getDownloadUrl(module, metadata.path, apiClient)
      .then(setDownloadUrl)
      .catch(() => setDownloadUrl(''))
  }, [module, metadata.path, apiClient])

  return (
    <div className="mt-6 pb-6 flex flex-col gap-4">
      {metadata.mime?.mime.startsWith('audio/') && downloadUrl && (
        <div>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={downloadUrl} controls preload="none" className="w-full" />
        </div>
      )}

      {metadata.mime && downloadUrl && (
        metadata.mime.mime.startsWith('image/')
          ? <img src={downloadUrl} alt={path.basename(metadata.path)} className="text-center" />
          : <ImagesFilePathView module={module} metadata={metadata} />
      )}

      {metadata.mime?.isText && <CodeHighlightView module={module} path={metadata.path} />}
      {metadata.audioTags && <AudioTagsView tags={metadata.audioTags} />}
      {metadata.mediainfo && <MediaInfoView mediainfo={metadata.mediainfo} />}
      {metadata.exif && <ExifView exif={metadata.exif} />}
      {metadata.mime?.mime === 'application/pdf' && <PdfView module={module} path={metadata.path} />}
    </div>
  )
}
