import type { FastifyInstance } from 'fastify'
import getItemChildrenController from './get-item-children-controller.ts'
import getItemController from './get-item-controller.ts'
import getLibraryChildrenController from './get-library-children-controller.ts'
import getRecentlyAddedController from './get-recently-added-controller.ts'
import getThumbnailController from './get-thumbnail-controller.ts'
import searchController from './search-controller.ts'

const mediaRoutesPlugin = async (app: FastifyInstance) => {
  await app.register(import('@fastify/static'), {
    root: '/',
    serve: false,
    dotfiles: 'allow',
    serveDotFiles: true,
    index: false,
  })

  app
    .get('/', getLibraryChildrenController.options, getLibraryChildrenController)
    .get('/recent', getRecentlyAddedController.options, getRecentlyAddedController)
    .get('/search', searchController.options, searchController)
    .get('/:key', getItemController.options, getItemController)
    .get('/:key/children', getItemChildrenController.options, getItemChildrenController)
    .get('/:key/thumbnail/:thumbnailKey', getThumbnailController.options, getThumbnailController)
}

export default mediaRoutesPlugin
