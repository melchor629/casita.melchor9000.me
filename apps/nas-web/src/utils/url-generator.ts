import type { ApiClient } from '../api/api-client'
import baseUrl from '../api/base-url'
import { createAlias } from '../api/fs'
import type { FileMetadata } from '../api/fs/file'
import * as path from './path'

export const iina = (downloadUrl: string) => `iina://open?url=${encodeURIComponent(downloadUrl)}`

export const androidIntent = (downloadUrl: string, mime: string) => `intent://${downloadUrl.substring(downloadUrl.indexOf('://') + 3)}#Intent;scheme=http;action=android.intent.action.VIEW;type=${mime};end`

export const plsFromFiles = async (module: string, files: FileMetadata[], apiClient: ApiClient) => {
  const mediaFiles = files
    .filter((file) => file.mime && (file.mime.mime.startsWith('audio') || file.mime.mime.startsWith('video')))
    .filter((file) => !file.hidden)

  if (mediaFiles.length === 0) {
    return null
  }

  const baseUrlWithoutSlash = baseUrl.replace(/\/$/, '')
  const { urls } = await createAlias(apiClient, module, mediaFiles.map((file) => file.path))
  let pls = `[playlist]\nNumberOfEntries=${mediaFiles.length}\n`
  pls += mediaFiles
    .filter((file) => urls[file.path])
    .map((file) => ({
      name: path.basename(file.path),
      url: `${baseUrlWithoutSlash}${urls[file.path]}`,
    }))
    .map((file, i) => `File${i}=${file.url}\nTitle${i}=${file.name}`)
    .join('\n')
  pls += '\n'

  const blob = new Blob([new TextEncoder().encode(pls)], { type: 'audio/x-scpls;charset=utf-8' })
  const file = new File(
    [blob],
    `${path.basename(path.dirname(mediaFiles[0].path))}.pls`,
    { type: 'audio/x-scpls;charset=utf-8' },
  )
  return URL.createObjectURL(file)
}
