import { type Entry, type RootEntry, getRouteTree } from '../route-tree.ts'

const addImport = (imports: string[], prefix: string, entry: string) => {
  const name = `${prefix}${imports.length}`
  imports.push(`const ${name} = () => import(${JSON.stringify(entry)})`)
  return name
}

const serializeEntry = (entry: Entry | RootEntry, imports: string[]): string => {
  if ('route' in entry) {
    let ser = '{'
    if (entry.middlewareEntry) {
      imports.push(`const middleware = () => import(${JSON.stringify(entry.middlewareEntry)})`)
      ser += '  middleware,\n'
    }
    if (entry.rootLayoutEntry) {
      imports.push(`const rootLayout = () => import(${JSON.stringify(entry.rootLayoutEntry)})`)
      ser += '  rootLayout,\n'
    }
    ser += `  route: ${serializeEntry(entry.route, imports)}\n}`
    return `Object.freeze(${ser})`
  }

  let ser = 'Object.freeze({'
  ser += `  pathname: ${JSON.stringify(entry.path)},\n`
  ser += '  matcher: /^\\/'
    + entry.path
      .split('/')
      .map((s) => s.replace(/^\([\w-]+\)$/, ''))
      .map((s) => s.replace(/^\[([\w-]+)\]$/, '(?<$1>[^/]+?)'))
      .filter((s) => !!s)
      .join('\\/')
  if (!ser.endsWith('/^\\/')) {
    ser += '(?:\\/|$)/,\n'
  } else {
    ser += '/,\n'
  }

  if (entry.layoutEntry) {
    const name = addImport(imports, 'layout', entry.layoutEntry)
    ser += `  layout: ${name},\n`
  }
  if (entry.notFoundEntry) {
    const name = addImport(imports, 'notFound', entry.notFoundEntry)
    ser += `  notFound: ${name},\n`
  }
  if (entry.errorEntry) {
    const name = addImport(imports, 'error', entry.errorEntry)
    ser += `  error: ${name},\n`
  }
  if (entry.type === 'route') {
    const name = addImport(imports, 'route', entry.entry)
    ser += `  type: "route",\n  entry: ${name},\n`
  } else if (entry.type === 'page') {
    const name = addImport(imports, 'page', entry.entry)
    ser += `  type: "page",\n  entry: ${name},\n`
  } else {
    ser += '  type: "nothing",\n'
  }
  ser += `  children: [\n${entry.children.map((child) => serializeEntry(child, imports)).join(',\n')}\n]`

  return `${ser}\n})`
}

export default async function generateSsrRoutes() {
  const routeTree = await getRouteTree()
  const imports: string[] = []
  const routesSerialized = serializeEntry(routeTree, imports)
  return `${imports.join('\n')}\nconst routes = ${routesSerialized}\nexport default routes`
}
