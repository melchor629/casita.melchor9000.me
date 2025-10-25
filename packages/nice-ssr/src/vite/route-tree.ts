import fs from 'node:fs/promises'
import path from 'node:path'
import { getAppPath, getMiddlewarePath, getRootLayoutPath, unsafeExists } from './utils.ts'

export type RootEntry = {
  rootLayoutEntry: string | null
  middlewareEntry: string | null
  route: Entry
}

export type Entry = PageEntry | RouteEntry | NothingEntry

type NothingEntry = BaseEntry & {
  type: 'nothing'
  groupName?: string
}

export type PageEntry = BaseEntry & {
  type: 'page'
  entry: string
}

type RouteEntry = BaseEntry & {
  type: 'route'
  entry: string
}

type BaseEntry = {
  path: string
  layoutEntry?: string
  notFoundEntry?: string
  errorEntry?: string
  children: Entry[]
  parent: Entry | null
}

const scoreEntry = (entry: Entry) =>
  (entry.path.endsWith(']') ? 1000 : 0) + entry.path.length

async function getEntry(entryPath: string, parent: Entry | null): Promise<Entry> {
  let entry: Entry = {
    path: path.join('/', entryPath),
    type: 'nothing',
    children: [],
    parent,
  }
  if (path.basename(entryPath).match(/^\([\w-]+\)$/)) {
    entry.groupName = path.basename(entryPath).slice(1, -1)
  }
  for (const route of await fs.readdir(getAppPath(entryPath), { withFileTypes: true })) {
    if (route.isDirectory()) {
      entry.children.push(await getEntry(path.join(entryPath, route.name), entry))
    } else if (route.isFile()) {
      const completePath = getAppPath(path.join(entryPath, route.name))
      const { dir: pathname, name: pathType } = path.parse(completePath)
      if (pathType === 'route' || pathType === 'page') {
        if (entry.type !== 'nothing') {
          throw new Error(`Cannot have a route.ts and page.tsx for the same route ${pathname}`)
        }
        entry = {
          ...entry,
          type: pathType,
          entry: path.resolve(completePath),
        }
        entry.children.forEach((c) => { c.parent = entry })
      } else if (pathType === 'layout') {
        entry.layoutEntry = path.resolve(completePath)
      } else if (pathType === 'not-found') {
        entry.notFoundEntry = path.resolve(completePath)
      } else if (pathType === 'error') {
        entry.errorEntry = path.resolve(completePath)
      }
    }
  }
  // sort entries from smaller to large pathname, dynamic will be always at the end
  entry.children.sort((a, b) => scoreEntry(a) - scoreEntry(b))
  return entry
}

export async function getRouteTree(): Promise<RootEntry> {
  const routeTree: RootEntry = {
    middlewareEntry: null,
    rootLayoutEntry: null,
    route: await getEntry('', null),
  }

  const middlewarePath = getMiddlewarePath()
  if (await unsafeExists(middlewarePath)) {
    routeTree.middlewareEntry = middlewarePath
  }

  const rootLayoutPath = getRootLayoutPath()
  if (await unsafeExists(rootLayoutPath)) {
    routeTree.rootLayoutEntry = rootLayoutPath
  }

  return routeTree
}

export async function getPageEntry(path: string): Promise<PageEntry | undefined> {
  // Not optimized at all :|
  const routeTree = await getRouteTree()
  let entry: Entry | undefined = { children: [routeTree.route] } as Entry
  while (entry != null) {
    if (entry.path === path && entry.type === 'page') {
      return entry
    }
    entry = entry.children.find((e) => path.startsWith(e.path))
  }
  return entry
}
