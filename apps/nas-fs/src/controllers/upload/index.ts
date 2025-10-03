import type { FastifyInstance } from 'fastify'
import cancelUploadController from './cancel-upload.ts'
import doUploadController from './do-upload.ts'
import endUploadController from './end-upload.ts'
import fullUploadController from './full-upload.ts'
import startUploadController from './start-upload.ts'

const uploadRoutesPlugin = async (fastify: FastifyInstance) => {
  await fastify.register(import('@fastify/multipart'), {
    limits: {
      fileSize: 10_000_000,
    },
  })

  fastify
    .put('/', startUploadController.options, startUploadController)
    .post('/', fullUploadController.options, fullUploadController)
    .post('/:uploadToken', doUploadController.options, doUploadController)
    .patch('/:uploadToken', endUploadController.options, endUploadController)
    .delete('/:uploadToken', cancelUploadController.options, cancelUploadController)
}

export default uploadRoutesPlugin
