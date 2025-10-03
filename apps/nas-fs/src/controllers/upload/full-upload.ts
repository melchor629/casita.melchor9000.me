import { createHash } from 'crypto'
import { once } from 'node:events'
import fs from 'node:fs'
import path from 'node:path'
import { pathPrefix } from '../../config.ts'
import { applicationKeyParam } from '../../models/app.ts'
import { Binary, Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema } from '../../models/errors/api-error.ts'
import BadRequestError from '../../models/errors/bad-request-error.ts'
import { FullUploadRequestSchema, type FullUploadRequest } from '../../models/uploads/full-upload-request.ts'

const schema = {
  summary: 'Uploads a small file directly',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  consumes: ['multipart/form-data'],
  body: Type.Object({
    data: Binary(),
    request: FullUploadRequestSchema,
  }),
  response: {
    default: ApiErrorSchema,
    201: Type.Null({ description: 'Response for uploading a file completely' }),
  },
  tags: ['upload'],
}

const hashString = (str: string) => createHash('SHA512')
  .update(str)
  .digest('hex')

const fullUploadController: Controller<typeof schema> = async (req, reply) => {
  // ignore body validation errors
  if (req.validationError && req.validationError.validationContext !== 'body') {
    throw req.validationError
  }

  let ctx: {
    directoryPath: string,
    fileName: string,
    path: string,
    realPath: string,
    uploadPath: string,
  } | null = null
  for await (const part of req.parts({ limits: { parts: 2, files: 1, fields: 1 } })) {
    if (part.type === 'field') {
      if (part.fieldname === 'request') {
        if (part.mimetype !== 'application/json') {
          throw new BadRequestError('"request" field is not a json')
        }

        const request = JSON.parse(part.value as string) as FullUploadRequest
        if (!request.directoryPath) {
          throw new BadRequestError('"directoryPath" is empty', 'request.directoryPath')
        }
        if (!request.fileName) {
          throw new BadRequestError('"fileName" is empty', 'request.fileName')
        }
        if (!path.isAbsolute(request.directoryPath)) {
          throw new BadRequestError('"directoryPath" is not absolute', 'request.directoryPath')
        }

        const { storagePath, uploadPath: uploadsPath } = req.appTenant!
        const realDirPath = path.join(storagePath, path.normalize(request.directoryPath))
        const realPath = path.join(realDirPath, request.fileName)
        const relativePath = path.join(path.normalize(request.directoryPath), request.fileName)
        if (!fs.existsSync(realDirPath)) {
          throw new BadRequestError('Directory must exist', 'request.directoryPath')
        }
        if (fs.existsSync(realPath)) {
          throw new BadRequestError('File must not exist', 'request.fileName')
        }

        ctx = {
          directoryPath: request.directoryPath,
          fileName: request.fileName,
          realPath,
          path: relativePath,
          uploadPath: path.join(uploadsPath, hashString(relativePath)),
        }
      }
    } else if (part.type === 'file') {
      if (ctx === null) {
        // consume whole stream before failing
        part.file.resume()
        throw new BadRequestError('"request" field has not been sent or has been sent after the file', 'request')
      }

      const inStream = part.file
      const outStream = fs.createWriteStream(ctx.uploadPath, { flags: 'wx' })
      inStream.pipe(outStream)
      await once(outStream, 'close')
      if (part.file.truncated) {
        await fs.promises.rm(ctx.uploadPath)
        throw new BadRequestError('File is larger than 10MB', part.fieldname)
      } else {
        await fs.promises.rename(ctx.uploadPath, ctx.realPath)
        await req.appTenant!.notifier.addFile(ctx.path)
        await reply.redirect(`${pathPrefix ?? ''}/info/${ctx.path}`, 201)
      }
    }
  }
}

fullUploadController.options = {
  config: {
    authorization: {
      write: true,
    },
    jwt: {},
  },
  schema,
  attachValidation: true,
}

export default fullUploadController
