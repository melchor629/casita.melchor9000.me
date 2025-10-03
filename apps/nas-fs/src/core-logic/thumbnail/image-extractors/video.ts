import { execa } from 'execa'
import type { File } from '../../../models/fs/file.ts'
import type { MediaInfoTrack } from '../../../models/mediainfo.ts'
import { type ExtractedImage, getMetadata } from './core.ts'

const getVideoImage = async (path: string, time: number, colourPrimaries?: string) => {
  const dataChunks: Buffer[] = []
  const logChunks: Buffer[] = []
  const videoFilters = []
  if (colourPrimaries?.toLowerCase().includes('bt.2020')) {
    // SEE https://github.com/immich-app/immich/blob/main/server/src/utils/media.ts#L284 for tonemapping options
    videoFilters.push('-vf', 'tonemapx=tonemap=mobius:desat=0:p=bt709:t=bt709:m=bt709:r=pc:peak=100:format=yuv420p')
  }
  const ffmpeg = execa('ffmpeg', [
    '-nostats',
    '-hide_banner',
    '-ss',
    time.toFixed(0),
    '-i',
    path,
    ...videoFilters,
    '-c:v',
    'libwebp',
    '-compression_level:v',
    '5',
    '-quality:v',
    '90',
    '-frames:v',
    '1',
    '-f',
    'image2pipe',
    '-',
  ], { buffer: false, encoding: 'buffer', reject: false })
  ffmpeg.stdout.on('data', (chunk: Buffer) => dataChunks.push(chunk))
  ffmpeg.stderr.on('data', (chunk: Buffer) => logChunks.push(chunk))

  const res = await ffmpeg

  if (res.exitCode) {
    const stderr = Buffer.concat(logChunks).toString('utf-8')
    throw new Error(`ffmpeg failed with exit code ${res.exitCode}: ${res.command}\n${stderr}`)
  }

  return Buffer.concat(dataChunks)
}

const getImagesFromVideo = async (metadata: File): Promise<ExtractedImage[]> => {
  const videoTrack = metadata.mediainfo?.media.track.find((t) => t['@type'] === 'Video') as MediaInfoTrack | undefined
  if (!videoTrack) {
    return []
  }

  const duration = parseFloat(videoTrack.Duration)
  const colourPrimaries = videoTrack.colour_primaries
  const times = duration > 300
    ? [
        duration * 0.05,
        duration * 0.1,
        duration * 0.15,
        duration * 0.2,
        duration * 0.25,
      ]
    : [
        duration * 0.05,
        duration * 0.15,
        duration * 0.3,
      ]
  const images: ExtractedImage[] = []
  for (const time of times) {
    images.push({
      data: await getVideoImage(metadata.realPath, time, colourPrimaries),
      format: 'image/webp',
      type: `Capture at time ${time.toFixed(0)} seconds`,
    })
  }

  return Promise.all(
    images.map(async (image) => ({ ...image, ...(await getMetadata(image.data)) })),
  )
}

export default getImagesFromVideo
