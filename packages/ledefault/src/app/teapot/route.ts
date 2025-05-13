import { SsrResponse, type SsrRequest } from '@melchor629/nice-ssr'

export function GET(req: SsrRequest) {
  req.nice.log.info('I\'m a teapot :3')
  return Promise.resolve(SsrResponse.new().status('teapot').empty())
}
