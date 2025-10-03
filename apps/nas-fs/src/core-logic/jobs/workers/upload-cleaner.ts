import { join } from 'node:path'
import type { Job } from 'bullmq'
import fs from 'fs-extra'
import { apps } from '../../../config.ts'
import type { UploadManifest } from '../../../models/uploads/upload-manifest.ts'
import getApp from '../../app.ts'
import { queues } from '../constants.ts'
import BaseWorker from './base-worker.ts'

export type UploadCleanerJobData = object

const readUploadFiles = async (uploadsPath: string) => {
  const paths: string[] = []
  for await (const path of await fs.opendir(uploadsPath)) {
    if (path.isFile()) {
      paths.push(path.name)
    }
  }
  return paths
}

const uploadCleanerProcessor = async (job: Job<UploadCleanerJobData>) => {
  for (const appIdentifier of Object.keys(apps)) {
    const app = getApp(appIdentifier)
    if (!app) {
      throw new Error(`App ${appIdentifier} does not exist`)
    }

    const logger = app.logger.child({ module: 'worker.upload-cleaner' })
    logger.info({ jobId: job.id }, 'Started job for app')

    const { cache, uploadPath } = app
    const inDiskUploadPaths = await readUploadFiles(uploadPath)
    const uploadPaths: [string, string][] = []
    for await (const uploadManifestKeys of cache.getKeysIterator('upload:*', 100)) {
      const paths = (await cache.multipleGet<UploadManifest>(...uploadManifestKeys))
        .map((m, i) => [m?.uploadPath, uploadManifestKeys[i]] as const)
        .filter((p): p is [string, string] => !!p[0])
      uploadPaths.push(...paths)
    }

    // detect orphan upload files
    const orphanFiles = inDiskUploadPaths.filter((p) => !uploadPaths.find(([m]) => m === p))
    logger.debug(`Detected ${orphanFiles.length} orphan files to clean up`)
    await Promise.all(orphanFiles.map((path) => {
      logger.debug({ path, jobId: job.id }, `Removing ${path}`)
      return fs.unlink(join(uploadPath, path))
    }))

    logger.info({ jobId: job.id }, 'Job finished for app')
  }
}

const uploadCleanerWorker = new BaseWorker(
  queues.uploadCleaner,
  uploadCleanerProcessor,
  {
    concurrency: 1,
  },
)

export default uploadCleanerWorker
