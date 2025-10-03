import { join } from 'node:path'
import { move } from 'fs-extra'
import { pathPrefix } from '../../config.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import { EndUploadResponseSchema } from '../../models/uploads/end-upload-request.ts'
import type { UploadManifest } from '../../models/uploads/upload-manifest.ts'
import uploadTokenSchema from '../../models/uploads/upload-token.ts'

const schema = {
  summary: 'Ends the upload session',
  params: Type.Object({
    appKey: applicationKeyParam,
    uploadToken: uploadTokenSchema,
  }),
  response: {
    default: ApiErrorSchema,
    201: EndUploadResponseSchema,
  },
  tags: ['upload'],
}

const endUploadController: Controller<typeof schema> = async (req, reply) => {
  const { uploadToken } = req.params
  const {
    cache, notifier, storagePath, uploadPath,
  } = req.appTenant!
  const cacheKey = `upload:${req.jwtToken!.payload.sub}:${uploadToken}`
  let manifest: UploadManifest | null
  try {
    manifest = await cache.get(cacheKey)
    if (!manifest) {
      reply.callNotFound()
      return
    }
  } catch {
    reply.callNotFound()
    return
  }

  await move(
    join(uploadPath, manifest.uploadPath),
    join(storagePath, manifest.path),
  )
  await Promise.all([
    cache.remove(cacheKey),
    notifier.addFile(manifest.path),
  ])

  reply
    .header('location', `${pathPrefix ?? ''}/info/${manifest.path}`)
    .status(201)
    .send({ path: manifest.path })
}

endUploadController.options = {
  config: {
    authorization: {
      write: true,
    },
    jwt: {},
  },
  schema,
}

export default endUploadController
