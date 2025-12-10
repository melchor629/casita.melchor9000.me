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
    <div className="mt-3">
      {metadata.mime?.mime.startsWith('audio/') && downloadUrl && (
        <div className="mb-4 text-center">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={downloadUrl} controls preload="none" className="w-100" />
        </div>
      )}

      {metadata.mime && downloadUrl && (
        <div className="mb-4 text-center">
          {metadata.mime.mime.startsWith('image/')
            ? <img src={downloadUrl} className="img-fluid" alt={path.basename(metadata.path)} />
            : <ImagesFilePathView module={module} metadata={metadata} />}
        </div>
      )}

      {metadata.mime?.isText && <CodeHighlightView module={module} path={metadata.path} />}
      {metadata.audioTags && <AudioTagsView tags={metadata.audioTags} />}
      {metadata.mediainfo && <MediaInfoView mediainfo={metadata.mediainfo} />}
      {metadata.exif && <ExifView exif={metadata.exif} />}
      {metadata.mime?.mime === 'application/pdf' && downloadUrl && (
        <iframe
          src={downloadUrl}
          className="border-0 embed-responsive"
          style={{ minHeight: 'calc(100vh - 176px - 6*1rem)' }}
          title={`${metadata.path} PDF Preview`}
        />
      )}
    </div>
  )
}
