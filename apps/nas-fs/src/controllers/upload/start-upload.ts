import { createHash } from 'crypto'
import fs from 'node:fs'
import path from 'node:path'
import { nanoid } from 'nanoid'
import { ensureExists, ensureNotExists } from '../../core-logic/fs/utils.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import BadRequestError from '../../models/errors/bad-request-error.ts'
import { StartUploadRequestSchema, StartUploadResponseSchema } from '../../models/uploads/start-upload-request.ts'
import type { UploadManifest } from '../../models/uploads/upload-manifest.ts'

const schema = {
  summary: 'Starts a upload session',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  body: StartUploadRequestSchema,
  response: {
    default: ApiErrorSchema,
    200: StartUploadResponseSchema,
  },
  tags: ['upload'],
}

const hashString = (str: string) => createHash('SHA512')
  .update(str)
  .digest('hex')

const startUploadController: Controller<typeof schema> = async (req, reply) => {
  const { directoryPath, fileName } = req.body
  let { uploadToken } = req.body

  if (!path.isAbsolute(directoryPath)) {
    throw new BadRequestError('directoryPath is not absolute', 'directoryPath')
  }

  const resume = !!uploadToken
  uploadToken = uploadToken ?? nanoid(30)
  const { cache, storagePath, uploadPath: uploadsPath } = req.appTenant!
  const dirPath = path.normalize(directoryPath)
  const filePath = path.join(dirPath, fileName)
  const uploadPath = hashString(filePath)
  const fullUploadPath = path.join(uploadsPath, uploadPath)
  const cacheKey = `upload:${req.jwtToken!.payload.sub}:${uploadToken}`
  let manifest: UploadManifest | null
  let startPosition = 0

  await ensureExists(path.join(storagePath, dirPath))
  if (resume) {
    manifest = await cache.get(cacheKey)

    if (!manifest || uploadToken !== manifest.uploadToken) {
      throw new BadRequestError('The uploadToken is invalid', 'uploadToken')
    }

    await ensureExists(fullUploadPath)
    startPosition = (await fs.promises.stat(fullUploadPath)).size
    await cache.expire(cacheKey, 60 * 60 * 1000)
  } else {
    await ensureNotExists(filePath).catch(() => {
      throw new BadRequestError('There is already a file with that name')
    })
    await ensureNotExists(fullUploadPath).catch(() => {
      throw new BadRequestError('This file is already being uploaded')
    })

    manifest = {
      path: filePath,
      uploadPath,
      uploadToken,
    }
    await cache.set(cacheKey, manifest, 60 * 60 * 1000)
  }

  reply.send({ uploadToken, startPosition })
}

startUploadController.options = {
  config: {
    authorization: {
      write: true,
    },
    jwt: {},
  },
  schema,
}

export default startUploadController
