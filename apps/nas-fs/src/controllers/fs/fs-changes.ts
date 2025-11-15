import { nanoid } from 'nanoid'
import { applicationKeyParam } from '../../models/app.ts'
import { ContentResponse, Type, type Controller } from '../../models/controller.ts'
import { ApiErrorSchema, NotFoundApiErrorSchema } from '../../models/errors/api-error.ts'

const schema = {
  summary: 'Listens for changes in the file system',
  params: Type.Object({
    appKey: applicationKeyParam,
  }),
  response: {
    default: ApiErrorSchema,
    200: ContentResponse({ 'text/event-stream': Type.Unknown() }, {
      description: 'Events',
    }),
    404: NotFoundApiErrorSchema,
  },
  tags: ['fs'],
}

const fsChangesSseController: Controller<typeof schema> = async (req, reply) => {
  if (!reply.sse) {
    reply.send()
    return
  }

  const { logger } = req.appTenant!
  logger.debug('Received connection for fs-changes SSE')
  const sse = reply.sse({ configurePings: 10_000 })

  sse.send({ comment: 'creating subscriptor' })
  const sub = await req.appTenant!.cache.createSubscriptor(sse.abortSignal)
  sub.on('message', (_, value) => {
    const { path, type } = JSON.parse(value) as { path: string, type: string }
    sse.send({
      event: type,
      data: JSON.stringify({ path }),
      id: nanoid(),
    })
  })
  await sub.subscribe('fs-events')

  sse.send({ comment: 'sending events' })
  await sse

  logger.debug({ reason: (sse.abortSignal.reason as Error)?.message }, 'Closing connection for SSE')
}

fsChangesSseController.options = {
  config: {
    authorization: {},
    jwt: {
      allowQuery: true,
    },
  },
  schema,
}

export default fsChangesSseController
