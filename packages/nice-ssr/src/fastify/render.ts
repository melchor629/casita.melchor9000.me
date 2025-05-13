import type { FastifyReply, FastifyRequest } from 'fastify'
import type * as EntryServer from '../entry/server.ts'
import { createRequest, writeResponse } from './mappers.ts'

async function handleSsrError(
  reply: FastifyReply,
  server: typeof EntryServer,
  processError: ((error: Error) => void) | undefined,
  err: unknown,
) {
  if (err instanceof Error) {
    if (server.isSsrError(err)) {
      const type = server.getSsrErrorType(err)
      if (type === 'not-found') {
        reply.log.debug('Received not found from code')
        await reply.renderPage('not-found')
        return true
      } else if (type === 'redirect') {
        reply.log.debug('Received redirect from code')
        await reply.redirect(err.message).send()
        return true
      }
    }

    processError?.(err)
  }

  reply.log.error(err, 'Failed processing route or middleware')
  return false
}

export async function runMiddleware(
  req: FastifyRequest,
  reply: FastifyReply,
  prefix: string,
  server: typeof EntryServer,
  processError?: (error: Error) => void,
) {
  try {
    const middleware = server.getMiddleware()
    if (middleware) {
      req.log.debug('Running middleware')
      const response = await middleware.execute(
        createRequest(req, reply),
        prefix,
        req.log.child({ routeType: 'middleware' }),
      )
      if (response.type === 'next') {
        req.log.debug('Middleware response is to continue')
        for (const [headerName, headerValue] of response.headers) {
          reply.header(headerName, headerValue)
        }
      } else {
        req.log.debug('Middleware response is send and finish')
        await writeResponse(response.response, reply, server)
      }
    }
  } catch (err) {
    if (!(await handleSsrError(reply, server, processError, err))) {
      await reply.status(500).send()
    }
  }
}

export async function renderRoute(
  req: FastifyRequest,
  reply: FastifyReply,
  route: ReturnType<(typeof EntryServer)['get']>,
  server: typeof EntryServer,
  processError?: (error: Error) => void,
  error?: unknown,
) {
  let log = req.log
  try {
    if (!route) {
      if (error) {
        return reply.status(500).send()
      } else {
        log.debug('Route not found')
        // TODO: handle page not found (404)
        return reply.status(404).send()
      }
    }

    log = log.child({ route: route.routePathname, routeType: route.type })
    log.debug('Generating response')
    const response = await route.render(
      createRequest(req, reply),
      log,
      req.url.split('?')[0].replace(/\/$/, ''),
    )

    log.debug('Sending response')
    await writeResponse(response, reply, server)
  } catch (e) {
    if (!(await handleSsrError(reply, server, processError, e))) {
      if (error) {
        // error page failed rendering, fail directly
        await reply.status(500).send()
      } else {
        await reply.renderErrorPage(
          e instanceof Error
            ? e
            : new Error('Unknown error throw from code, see logs for more'),
        )
      }
    }
  }
}
