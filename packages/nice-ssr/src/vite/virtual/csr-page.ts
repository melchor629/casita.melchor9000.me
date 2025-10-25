import { getPageEntry, type Entry, type PageEntry } from '../route-tree.ts'
import { getAppPath } from '../utils.ts'

const getLayouts = (pageEntry: Entry) => {
  const layouts = []
  let entry: Entry | null = pageEntry
  while (entry != null) {
    if (entry.layoutEntry) {
      layouts.unshift(getAppPath(entry.layoutEntry))
    }
    entry = entry.parent
  }
  return layouts
}

const getResolvedPageEntry = async (moduleId: string): Promise<[PageEntry | undefined, 'page' | 'not-found' | 'error']> => {
  if (moduleId.endsWith('/_not_found')) {
    const entry = await getPageEntry(`/${moduleId.slice(0, -11)}`)
    return [entry, 'not-found']
  }

  if (moduleId.endsWith('/_error')) {
    const entry = await getPageEntry(`/${moduleId.slice(0, -7)}`)
    return [entry, 'error']
  }

  return [await getPageEntry(`/${moduleId}`), 'page']
}

export default async function generateCsrPage(moduleId: string, devtools: 'none' | 'dev' | 'prod') {
  const [pageEntry, type] = await getResolvedPageEntry(moduleId)
  if (!pageEntry) return ''

  const entry = type === 'page'
    ? pageEntry.entry
    : (type === 'not-found' ? pageEntry.notFoundEntry : pageEntry.errorEntry)
  if (!entry) return ''

  const sourcePath = getAppPath(entry)
  const layouts = getLayouts(pageEntry)
  const pageRender = layouts
    .reduceRight((p, _, i) => `h(Layout${i}, { children: ${p} })`, 'h(Page, props)')
  const devtoolsImport = `import "${devtools === 'prod' ? 'preact/devtools' : 'preact/debug'}";`
  return `
${devtools !== 'none' ? devtoolsImport : ''}
import { hydrate, render, h } from 'preact'
import Page from ${JSON.stringify(sourcePath)}
${layouts.map((p, i) => `import Layout${i} from ${JSON.stringify(p)}`).join('\n')}

const container = document.getElementById('app')
if (container == null) {
  throw new Error('Container #app is not present, cannot render app.\\nEnsure to have a container with ID "id" in the root layout.')
}

export const hydratePage = (props) =>
  hydrate(${pageRender}, container)

export const renderPage = (props) =>
  render(${pageRender}, container)
  `.trim()
}
