import type { PagePathModule, PathModule, RootPathModule, RoutePathModule } from 'virtual:ssr/routes'

const modules = import.meta.glob([
  '/src/app/middleware.{t,j}s',
  '/src/app/**/page.{t,j}sx',
  '/src/app/**/route.{t,j}s',
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
  for (const path of Object.keys(modules).toSorted(comparePathLength)) {
    addNode(tree, path, modules[path])
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

function makeRoutesTree(pathname: `/${string}`, node: ModuleTreeNode): RootPathModule | PathModule {
  let module: PathModule = {
    type: 'nothing',
    pathname,
    matcher: makeMatcher(pathname),
    layout: getNodeModule(node, 'layout')?.module as PathModule['layout'],
    notFound: getNodeModule(node, 'not-found')?.module as PathModule['notFound'],
    error: getNodeModule(node, 'error')?.module as PathModule['error'],
    children: getFolderNodes(node)
      .map(([key, node]) => makeRoutesTree(joinPath(pathname, key), node) as PathModule),
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

const routes = makeRoutesTree('/', makeTree())

export default routes
