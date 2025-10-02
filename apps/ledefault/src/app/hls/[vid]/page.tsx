import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { notFound, type PageLoader, type Metadata } from '@melchor629/nice-ssr'
import { staticDirPath } from '@/config'
import Player from './player'

export type Manifest = Readonly<{
  title?: string
  artist?: string
  album?: string
  description?: string
  poster?: string
  src: {
    path: string
    type: string
  }
}>

type SsrProps = Readonly<{
  vid: string
  manifest: Manifest
}>

export const loader: PageLoader<SsrProps, { vid: string }> = async ({ nice: { params: { vid } } }) => {
  const videoPath = path.join(staticDirPath, 'hls', vid, 'manifest.json')
  try {
    const manifestJson = await readFile(videoPath, 'utf-8')
    const manifest = Object.freeze(JSON.parse(manifestJson) as Manifest)
    return {
      manifest,
      vid,
    }
  } catch {
    notFound()
  }
}

export const metadata = ({ manifest: { artist, description, title }, vid }: SsrProps): Metadata => {
  const titleParts = [
    'pi/video -',
    title ?? vid,
    artist && `(from ${artist})`,
  ].filter(Boolean).join(' ')
  return {
    title: titleParts,
    description,
    baseHref: `/hls/${vid}/`,
  }
}

export default function Page({ manifest }: SsrProps) {
  return <Player manifest={manifest} />
}
