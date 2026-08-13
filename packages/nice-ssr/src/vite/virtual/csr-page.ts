import { getAnyEntry, getPageEntry, type Entry, type PageEntry } from '../route-tree.ts'
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

const getErrorComponent = (pageEntry: Entry) => {
  let entry: Entry | null = pageEntry
  while (entry != null) {
    if (entry.errorEntry) {
      return getAppPath(entry.errorEntry)
    }
    entry = entry.parent
  }
}

const getResolvedPageEntry = async (moduleId: string): Promise<[PageEntry | undefined, 'page'] | [Entry | undefined, 'not-found' | 'error']> => {
  if (moduleId.endsWith('/_not_found')) {
    const entry = await getAnyEntry(`/${moduleId.slice(0, -11)}`)
    return [entry, 'not-found']
  }

  if (moduleId.endsWith('/_error')) {
    const entry = await getAnyEntry(`/${moduleId.slice(0, -7)}`)
    return [entry, 'error']
  }

  return [await getPageEntry(`/${moduleId}`), 'page']
}

export default async function generateCsrPage(moduleId: string) {
  const [pageEntry, type] = await getResolvedPageEntry(moduleId)
  if (!pageEntry) return ''

  const entry = type === 'page'
    ? pageEntry.entry
    : (type === 'not-found' ? pageEntry.notFoundEntry : pageEntry.errorEntry)
  if (!entry) {
    if (type === 'not-found') return 'export const renderPage = () => "not found (as developer, please implement the not found page)"'
    if (type === 'error') return 'export const renderPage = () => "error (as developer, please implement the error component)"'
    return ''
  }

  const sourcePath = getAppPath(entry)
  const layouts = getLayouts(pageEntry)
  const error = getErrorComponent(pageEntry)
  const pageRender = layouts
    .reduceRight((p, _, i) => `jsx(Layout${i}, { children: ${p} })`, 'jsx(ErrorBoundary, { children: jsx(Page, props), path: Error })')
  return `
import { jsx } from 'react/jsx-runtime';
import Page from ${JSON.stringify(sourcePath)}
${layouts.map((p, i) => `import Layout${i} from ${JSON.stringify(p)}`).join('\n')}
import ErrorBoundary from '@error'
${error ? `import Error from ${JSON.stringify(error)}` : 'const Error = () => "error (as developer, please implement the error component)"'}

export const renderPage = (props) => ${pageRender}
renderPage.displayName = \`\${Page.displayName || Page.name}Layout\`
  `.trim()
}
