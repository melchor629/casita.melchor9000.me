import fs from 'node:fs/promises'
import path from 'node:path'
import { getAppPath, getMiddlewarePath, getRootLayoutPath, unsafeExists } from '../utils.ts'

export default async function generateSsrRoutes() {
  let i = 0
  const imports: string[] = []
  const routes: Record<
    string,
    | { type: 'root-layout' | 'route' | 'page', entry: string }
    | { type: 'root-layout', entry: string }
    | { type: 'middleware', entry: string }
  > = {}
  for await (const route of fs.glob([getAppPath('**', 'page.tsx'), getAppPath('**', 'route.ts')])) {
    const { dir: pathname, name: pathType } = path.parse('/' + path.relative(getAppPath(), route))
    imports.push(`const route${i} = () => import('${path.resolve(route)}')`)
    if (pathname in routes) {
      throw new Error(`Cannot have a route.ts and page.tsx for the same route ${pathname}`)
    }

    routes[pathname] = { type: pathType as 'route' | 'page', entry: `route${i}` }
    i += 1
  }

  const middlewarePath = getMiddlewarePath()
  if (await unsafeExists(middlewarePath)) {
    imports.push(`const middleware = () => import('${middlewarePath}')`)
    routes['$Middleware'] = { type: 'middleware', entry: 'middleware' }
  }

  const rootLayoutPath = getRootLayoutPath()
  if (await unsafeExists(rootLayoutPath)) {
    imports.push(`const RootLayout = () => import('${rootLayoutPath}')`)
    routes['$RootLayout'] = { type: 'root-layout', entry: 'RootLayout' }
  }

  const routesInfo = Object.entries(routes)
    .map(([pathname, route]) => {
      if (route.type === 'root-layout') {
        return `{ type: '${route.type}', entry: ${route.entry} }`
      }

      if (route.type === 'page' || route.type === 'route') {
        return `{ type: '${route.type}', pathname: ${JSON.stringify(pathname)}, entry: ${route.entry} }`
      }

      if (route.type === 'middleware') {
        return `{ type: '${route.type}', pathname: ${JSON.stringify(pathname)}, middleware: ${route.entry} }`
      }

      return 'false'
    })
    .map((f) => `Object.freeze(${f})`)
  return `${imports.join('\n')}\nconst routes = Object.freeze([${routesInfo.join(',')}])\nexport default routes`
}
