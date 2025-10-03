import type { FastifyInstance } from 'fastify'
import createUrlAliasController from './create-url-alias.ts'
import fsChangesController from './fs-changes.ts'
import getUrlAliasController from './get-url-alias.ts'
import infoController from './info.ts'
import moveController from './move.ts'
import newFolderController from './new-folder.ts'
import removeController from './remove.ts'
import storageController from './storage.ts'
import thumbnailDeleteController from './thumbnail-delete.ts'
import thumbnailManifestController from './thumbnail-manifest.ts'
import thumbnailController from './thumbnail.ts'

const fsRoutesPlugin = async (app: FastifyInstance) => {
  await app.register(import('@fastify/static'), {
    root: '/',
    serve: false,
    dotfiles: 'allow',
    serveDotFiles: true,
    index: false,
  })

  app
    .get('/info/*', infoController.options, infoController)
    .get('/storage/*', storageController.options, storageController)
    .post('/move', moveController.options, moveController)
    .post('/remove', removeController.options, removeController)
    .post('/new-folder', newFolderController.options, newFolderController)
    .get('/thumbnail/*', thumbnailController.options, thumbnailController)
    .delete('/thumbnail/*', thumbnailDeleteController.options, thumbnailDeleteController)
    .get('/thumbnail-manifest/*', thumbnailManifestController.options, thumbnailManifestController)
    .post('/a', createUrlAliasController.options, createUrlAliasController)
    .get('/a/:id', getUrlAliasController.options, getUrlAliasController)
    .get('/a/:id/:num(\\d+)', getUrlAliasController.options, getUrlAliasController)

  await app.register(async (f) => {
    await f.register(import('../../middlewares/sse.ts'))
    f.get('', fsChangesController.options, fsChangesController)
  }, { prefix: '/fs-changes' })
}

export default fsRoutesPlugin
