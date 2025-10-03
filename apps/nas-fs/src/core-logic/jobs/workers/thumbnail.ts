import fs from 'node:fs/promises'
import { join } from 'node:path'
import type { Job } from 'bullmq'
import type { File } from '../../../models/fs/file.ts'
import getApp from '../../app.ts'
import { directoryWalker, info } from '../../fs/index.ts'
import generateThumbnail from '../../thumbnail/generate-thumbnail.ts'
import { readOrCreateThubnailManifest } from '../../thumbnail/index.ts'
import { queues } from '../constants.ts'
import type { AppJobData } from '../types.ts'
import BaseWorker, { type TracingContext } from './base-worker.ts'

export interface ThumbnailJobData extends AppJobData {
  path: string
  generateThumbnails?: {
    sizes: Array<'xsm' | 'sm' | 'md' | 'lg' | 'xlg'>
    formats: Array<'jpg' | 'webp' | 'png' | 'avif'>
  }
}

const thumbnailProcessor = async (
  job: Job<ThumbnailJobData>,
  _: unknown,
  { createSpan }: TracingContext,
) => {
  const { appIdentifier, generateThumbnails, path } = job.data
  const app = getApp(appIdentifier)
  if (!app) {
    throw new Error(`App ${appIdentifier} does not exist`)
  }

  const paths: string[] = []
  await createSpan('thumbnail get-info', async () => {
    const metadata = await info(app, path)
    if (metadata.type === 'dir') {
      for await (const [p, t] of await directoryWalker(app, job.data.path, { recursive: true })) {
        if (t === 'file') {
          paths.push(p)
        }
      }
    } else {
      paths.push(path)
    }
  })

  await job.updateProgress(10)

  let i = 1
  await createSpan('thumbnail generate-thumbnails', async () => {
    for (const p of paths) {
      const manifest = await createSpan(
        `thumbnail read-or-create-thumbnail-manifest ${p}`,
        async () => readOrCreateThubnailManifest(app, await info(app, p) as File),
      )
      const progress = 10 + (i / paths.length) * 90
      await job.updateProgress(progress)

      if (generateThumbnails && manifest.images.length > 0) {
        const { formats, sizes } = generateThumbnails
        const fullThumbnailFolderPath = join(app.thumbnailPath, manifest.path)
        for (const size of sizes) {
          for (const format of formats) {
            for (let n = 0; n < manifest.images.length; n += 1) {
              const fullThumbnailPath = `${join(fullThumbnailFolderPath, size, n.toString())}.${format}`
              const originalThumbnailPath = join(fullThumbnailFolderPath, 'original', n.toString())
              const canAccess = await fs.access(fullThumbnailPath, fs.constants.R_OK)
                .then(() => true)
                .catch(() => false)
              if (!canAccess) {
                await createSpan(
                  `thumbnail generate-thumbnail ${p} ${size} ${n} ${format}`,
                  () => generateThumbnail(originalThumbnailPath, fullThumbnailPath, size, format),
                )
              }
            }
          }
        }
      }

      i += 1
    }
  })

  return {
    processed: paths,
  }
}

const thumbnailWorker = new BaseWorker(queues.thumbnail, thumbnailProcessor, {
  concurrency: 1,
})

export default thumbnailWorker
