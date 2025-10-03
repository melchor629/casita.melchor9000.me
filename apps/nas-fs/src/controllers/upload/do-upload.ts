import { once } from 'node:events'
import fs from 'node:fs'
import { join } from 'node:path'
import { applicationKeyParam } from '../../models/app.ts'
import { Binary, Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { DoUploadResponseSchema } from '../../models/uploads/do-upload-request.ts'
import type { UploadManifest } from '../../models/uploads/upload-manifest.ts'
import uploadTokenSchema from '../../models/uploads/upload-token.ts'

const schema = {
  summary: 'Uploads a part for the current session',
  params: Type.Object({
    appKey: applicationKeyParam,
    uploadToken: uploadTokenSchema,
  }),
  consumes: ['multipart/form-data'],
  body: Type.Object({
    data: Binary(),
  }),
  response: {
    default: ApiErrorSchema,
    200: DoUploadResponseSchema,
  },
  tags: ['upload'],
}

const doUploadController: Controller<typeof schema> = async (req, reply) => {
  // ignore body validation errors
  if (req.validationError && req.validationError.validationContext !== 'body') {
    throw req.validationError
  }

  const { uploadToken } = req.params
  const { cache, uploadPath } = req.appTenant!
  const cacheKey = `upload:${req.jwtToken!.payload.sub}:${uploadToken}`
  const manifest = await cache.get<UploadManifest>(cacheKey)
  if (!manifest) {
    reply.callNotFound()
    return
  }

  const fullUploadPath = join(uploadPath, manifest.uploadPath)
  const fileSize = (await fs.promises.stat(fullUploadPath).catch(() => ({ size: 0 }))).size
  const file = await req.file({ limits: { files: 1, fields: 0, parts: 1 } })
  if (!file) {
    reply.send({
      bytesWritten: 0,
      position: fileSize,
    })
    return
  }

  const outStream = fs.createWriteStream(fullUploadPath, { flags: 'a' })
  file.file.pipe(outStream)
  await once(outStream, 'close')
  await cache.expire(cacheKey, 60 * 60 * 1000)
  reply.send({
    bytesWritten: outStream.bytesWritten,
    position: fileSize + outStream.bytesWritten,
  })
}

doUploadController.options = {
  config: {
    /* authorization: {
      write: true,
    },
    jwt: {}, */
  },
  schema,
  attachValidation: true,
}

export default doUploadController
