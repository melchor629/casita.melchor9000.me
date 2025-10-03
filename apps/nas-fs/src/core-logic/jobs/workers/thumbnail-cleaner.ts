import { join } from 'node:path'
import type { Job } from 'bullmq'
import fs from 'fs-extra'
import { apps } from '../../../config.ts'
import type { ThumbnailManifest } from '../../../models/thumbnails/thumbnail-manifest.ts'
import getApp from '../../app.ts'
import { queues } from '../constants.ts'
import BaseWorker from './base-worker.ts'

export type ThumbnailCleanerJobData = object

const ignoredPaths = ['_media']

const readThumbnailFolders = async (thumbnailPath: string) => {
  const paths: string[] = []
  for await (const path of await fs.opendir(thumbnailPath)) {
    if (path.isDirectory() && !ignoredPaths.includes(path.name)) {
      paths.push(path.name)
    }
  }
  return paths
}

const thumbnailCleanerProcessor = async (job: Job<ThumbnailCleanerJobData>) => {
  for (const appIdentifier of Object.keys(apps)) {
    const app = getApp(appIdentifier)
    if (!app) {
      throw new Error(`App ${appIdentifier} does not exist`)
    }

    const logger = app.logger.child({ module: 'worker.thumbnail-cleaner' })
    logger.info({ jobId: job.id }, 'Started job for app')

    const { cache, thumbnailPath } = app
    const inDiskThumbnailPaths = await readThumbnailFolders(thumbnailPath)
    const thumbnailPaths: [string, string][] = []
    for await (const thumbnailManifestKeys of cache.getKeysIterator('*:thumbnail', 100)) {
      const paths = (await cache.multipleGet<ThumbnailManifest>(...thumbnailManifestKeys))
        .map((m, i) => [m?.path, thumbnailManifestKeys[i]] as const)
        .filter((p): p is [string, string] => !!p[0])
      thumbnailPaths.push(...paths)
    }

    // detect orphan thumbnail folders
    const orphanFolders = inDiskThumbnailPaths.filter((p) => !thumbnailPaths.find(([m]) => m === p))
    logger.debug(`Detected ${orphanFolders.length} orphan folders to clean up`)
    await Promise.all(orphanFolders.map((path) => {
      logger.debug({ path, jobId: job.id }, `Removing ${path}`)
      return fs.remove(join(thumbnailPath, path))
    }))

    // detect manifests without original images
    const invalidThumbnailManifests = thumbnailPaths
      .filter(([p]) => !inDiskThumbnailPaths.find((m) => m === p))
    logger.debug(`Detected ${invalidThumbnailManifests.length} invalid manifests to remove`)
    await cache.remove(...invalidThumbnailManifests.map(([, thumbnailKey]) => {
      logger.debug({ thumbnailKey, jobId: job.id }, `Removing manifest ${thumbnailKey}`)
      return thumbnailKey
    }))

    logger.info({ jobId: job.id }, 'Job finished for app')
  }
}

const thumbnailCleanerWorker = new BaseWorker(
  queues.thumbnailCleaner,
  thumbnailCleanerProcessor,
  {
    concurrency: 1,
  },
)

export default thumbnailCleanerWorker
