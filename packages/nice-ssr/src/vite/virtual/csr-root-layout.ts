import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { getRouteTree } from '../route-tree.js'

export default async function generateCsrRootLayout() {
  const src = await readFile(path.resolve(import.meta.dirname, '..', '..', 'csr-entry.js'), 'utf-8')
  let rootLayout = 'const RootLayout = null'
  const { rootLayoutEntry } = await getRouteTree()
  if (rootLayoutEntry) {
    rootLayout = `import RootLayout from ${JSON.stringify(rootLayoutEntry)}`
  }
  return src.replace("import RootLayout from 'virtual:csr:root-layout'", rootLayout)
}
