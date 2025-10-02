import type { SsrRequest } from '../nice-ssr/request'
import { SsrResponse } from '../nice-ssr/response'
import type { RouteModule } from '../nice-ssr/route'

export default async function runRouteHandler(module: RouteModule, request: SsrRequest): Promise<Response> {
  const method = request.method as keyof (typeof module)
  if (method in module && module[method] != null) {
    const response = await module[method](request)
    return response
  }

  return SsrResponse
    .new()
    .status('method-not-allowed')
    .empty()
}
