import fs from 'node:fs'
import { join } from 'node:path'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { CancelUploadResponseSchema } from '../../models/uploads/cancel-upload-request.ts'
import type { UploadManifest } from '../../models/uploads/upload-manifest.ts'
import uploadTokenSchema from '../../models/uploads/upload-token.ts'

const schema = {
  summary: 'Cancels the upload session',
  params: Type.Object({
    appKey: applicationKeyParam,
    uploadToken: uploadTokenSchema,
  }),
  response: {
    default: ApiErrorSchema,
    200: CancelUploadResponseSchema,
  },
  tags: ['upload'],
}

const cancelUploadController: Controller<typeof schema> = async (req, reply) => {
  const { uploadToken } = req.params

  const { cache, uploadPath } = req.appTenant!
  const cacheKey = `upload:${req.jwtToken!.payload.sub}:${uploadToken}`
  const manifest = await cache.get<UploadManifest>(cacheKey)
  if (!manifest) {
    reply.callNotFound()
    return
  }

  await fs.promises.unlink(join(uploadPath, manifest.uploadPath)).catch(() => {})
  await cache.remove(cacheKey)
  reply.send({ done: true })
}

cancelUploadController.options = {
  config: {
    authorization: {
      write: true,
    },
    jwt: {},
  },
  schema,
}

export default cancelUploadController
