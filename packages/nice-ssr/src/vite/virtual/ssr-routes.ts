import type { PagePathModule, PathModule, RootPathModule, RoutePathModule } from 'virtual:ssr/routes'

const glob = import.meta.env.SSR
  ? import.meta.glob([
    '/src/app/middleware.{t,j}s',
    '/src/app/**/page.{t,j}sx',
    '/src/app/**/route.{t,j}s',
    '/src/app/**/layout.{t,j}sx',
    '/src/app/**/not-found.{t,j}sx',
    '/src/app/**/error.{t,j}sx',
  ], { base: '/src/app' })
  : import.meta.glob([
    '/src/app/**/page.{t,j}sx',
    '/src/app/**/layout.{t,j}sx',
    '/src/app/**/not-found.{t,j}sx',
    '/src/app/**/error.{t,j}sx',
  ], { base: '/src/app' })

const countSubstring = (string: string, pattern: string) => {
  let count = 0
  for (let i = 0; i <= string.length - pattern.length; i += 1) {
    if (string.slice(i, pattern.length) === pattern) count += 1
  }
  return count
}
const comparePathLength = (a: string, b: string) =>
  (countSubstring(a, '/') - countSubstring(b, '/')) || (a.length - b.length)
const joinPath = <const T extends string>(a: T, b: string): `${T}${string}` => {
  if (!a.endsWith('/')) b = '/' + b
  return `${a}${b}`
}

const addNode = (root: ModuleTreeNode, path: string, module: () => Promise<unknown>) => {
  let currentNode = root
  // ignore initial . and file name
  const pathParts = path.split('/').slice(1)
  for (const part of pathParts.slice(0, -1)) {
    if (part in currentNode && currentNode[part].type === 'folder') {
      currentNode = currentNode[part].node
    } else if (!(part in currentNode)) {
      currentNode[part] = { type: 'folder', node: {} }
      currentNode = currentNode[part].node
    }
  }

  const fileName = pathParts.at(-1)!
  currentNode[fileName] = Object.freeze({
    type: 'module',
    name: fileName.slice(0, fileName.lastIndexOf('.')),
    path,
    module,
  })
}

const getNodeModule = (node: ModuleTreeNode, fileName: string) =>
  Object.entries(node)
    .filter((pair): pair is [string, ModuleTreeModuleNode] => pair[1].type === 'module')
    .find(([, { name }]) => name === fileName)
    ?.[1]

const getFolderNodes = (node: ModuleTreeNode) =>
  Object.entries(node)
    .filter((pair): pair is [string, ModuleTreeFolderNode] => pair[1].type === 'folder')
    .map(([key, { node }]) => [key, node] as const)

type ModuleTreeModuleNode = Readonly<{ type: 'module', name: string, path: string, module: () => Promise<unknown> }>
type ModuleTreeFolderNode = { type: 'folder', node: ModuleTreeNode }
type ModuleTreeNode = Record<string, ModuleTreeModuleNode | ModuleTreeFolderNode>
function makeTree() {
  const tree: ModuleTreeNode = {}
  for (const path of Object.keys(glob).toSorted(comparePathLength)) {
    addNode(tree, path, glob[path])
  }
  return tree
}

const makeMatcher = (pathname: `/${string}`) => {
  let src = '^\\/'
    + pathname
      .split('/')
      .map((s) => s.replace(/^\([\w-]+\)$/, ''))
      .map((s) => s.replaceAll(/\[([\w-]+)\]/g, '(?<$1>[^/]+?)'))
      .filter((s) => !!s)
      .join('\\/')
  if (!src.endsWith('^\\/')) {
    src += '(?:\\/|$)'
  }

  return new RegExp(src, 'u')
}

const pathModuleHasParameter = (m: PathModule) =>
  /\[[\w-]+\]/.exec(m.pathname.split('/').at(-1) ?? '')
const comparePathModules = (a: PathModule, b: PathModule) =>
  comparePathLength(b.pathname, a.pathname) + (pathModuleHasParameter(a) ? 10_000 : 0) - (pathModuleHasParameter(b) ? 10_000 : 0)

function makeRoutesTree(pathname: '/'): RootPathModule
function makeRoutesTree(pathname: `/${string}`, node: ModuleTreeNode): PathModule
function makeRoutesTree(pathname: `/${string}`, node: ModuleTreeNode = makeTree()): RootPathModule | PathModule {
  let module: PathModule = {
    type: 'nothing',
    pathname,
    matcher: makeMatcher(pathname),
    layout: getNodeModule(node, 'layout')?.module as PathModule['layout'],
    notFound: getNodeModule(node, 'not-found')?.module as PathModule['notFound'],
    error: getNodeModule(node, 'error')?.module as PathModule['error'],
    children: getFolderNodes(node)
      .map(([key, node]) => makeRoutesTree(joinPath(pathname, key), node))
      .toSorted(comparePathModules),
  }

  const pageModule = getNodeModule(node, 'page')
  if (pageModule) {
    module = {
      ...module,
      type: 'page',
      entry: pageModule.module as PagePathModule['entry'],
    } satisfies PagePathModule
  }

  const routeModule = getNodeModule(node, 'route')
  if (routeModule) {
    if (pageModule) throw new Error(`Path ${pathname} is both a page and a route. Only one can be allowed!`)
    module = {
      ...module,
      type: 'route',
      entry: routeModule.module as RoutePathModule['entry'],
    } satisfies RoutePathModule
  }

  if (pathname === '/') {
    // this is the root folder
    const root: RootPathModule = {
      middleware: getNodeModule(node, 'middleware')?.module as RootPathModule['middleware'],
      route: module,
    }
    return root
  }

  return module
}

export const modules = makeRoutesTree('/')

const countPathSegments = (path: string) =>
  path.replaceAll(/\/\(\w+\)/g, '').replaceAll(/^\/|\/$/g, '').split('/').filter((s) => !!s).length

const calculateRoutePath = (
  path: string,
  route: PathModule,
): PathModule[] => {
  const match = route.matcher.exec(path)
  if (match == null) {
    return []
  }

  return [
    route,
    ...(
      Iterator.from(route.children)
        .map((r) => calculateRoutePath(path, r))
        .filter((rh) => rh.length > 0)
        .filter((rh) => rh.at(-1)!.type !== 'nothing')
        .toArray()
        .toSorted((a, b) => b.at(-1)!.matcher.exec(path)![0].length - a.at(-1)!.matcher.exec(path)![0].length)
        .at(0) ?? []
    ),
  ]
}

export function getModulePath(path: string, mode: 'exact' | 'nearest' = 'exact'): ReadonlyArray<PathModule> {
  path ||= '/'
  const routePath = calculateRoutePath(path, modules.route)
  const routeMatch = routePath.at(-1)
  if (!routeMatch) {
    return []
  }

  if (mode === 'exact' && countPathSegments(routeMatch.pathname) !== countPathSegments(path)) {
    return []
  }

  return routePath
}

const defaultErrorPathModule: NonNullable<PagePathModule['error']> = () => Promise.resolve({
  default: ({ error }) => `Page has error: ${error.message}.\n\nThis is a default error page, please add a error handler.`,
})

const defaultNotFoundPathModule: NonNullable<PagePathModule['notFound']> = () => Promise.resolve({
  default: () => 'Not found...\n\nThis is a default error page, please add a error handler.',
})

export function getRouteModulePath(path: string, type: 'page'): readonly [...PathModule[], PagePathModule] | null
export function getRouteModulePath(path: string, type: 'error' | 'not-found'): readonly [...PathModule[], PagePathModule]
export function getRouteModulePath(path: string, type: 'route'): readonly [...PathModule[], RoutePathModule] | null
export function getRouteModulePath(
  path: string,
  type: 'page' | 'route' | 'error' | 'not-found',
): readonly [...PathModule[], PagePathModule] | readonly [...PathModule[], RoutePathModule] | null {
  if (type === 'page' || type === 'route') {
    const modulePath = getModulePath(path, 'exact')
    const module = modulePath.at(-1)
    if (module?.type === 'page') {
      return Object.freeze([...modulePath.slice(0, -1), module] as const)
    }
    if (module?.type === 'route') {
      return Object.freeze([...modulePath.slice(0, -1), module] as const)
    }
    return null
  }

  if (type === 'error') {
    const modulePath = getModulePath(path, 'nearest')
    const errorRoutePathIndex = modulePath
      .findLastIndex((r) => r.error != null)
    const errorRoutePath = errorRoutePathIndex !== -1 ? modulePath[errorRoutePathIndex] : null
    return Object.freeze([
      ...modulePath.slice(0, errorRoutePathIndex),
      {
        children: [],
        layout: errorRoutePath?.layout,
        entry: (errorRoutePath?.error as never)
          ?? defaultErrorPathModule,
        matcher: /^$/,
        pathname: errorRoutePath?.pathname ?? '/',
        type: 'page',
      } satisfies PagePathModule,
    ])
  }

  if (type === 'not-found') {
    const modulePath = getModulePath(path, 'nearest')
    const notFoundRoutePathIndex = modulePath
      .findLastIndex((r) => r.notFound != null)
    const notFoundRoutePath = notFoundRoutePathIndex !== -1 ? modulePath[notFoundRoutePathIndex] : null
    return Object.freeze([
      ...modulePath.slice(0, notFoundRoutePathIndex),
      {
        children: [],
        layout: notFoundRoutePath?.layout,
        entry: (notFoundRoutePath?.notFound as never)
          ?? defaultNotFoundPathModule,
        matcher: /^$/,
        pathname: notFoundRoutePath?.pathname ?? '/',
        type: 'page',
      } satisfies PagePathModule,
    ])
  }

  return null
}
