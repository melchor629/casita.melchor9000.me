import { getAppPath } from '../utils.ts'

export default function generateCsrPage(moduleId: string) {
  const sourcePath = getAppPath(...moduleId.split('/'), 'page.tsx')
  return `
import { hydrate, h, options } from 'preact'
import Page from ${JSON.stringify(sourcePath)}

const container = document.getElementById('app')
if (container == null) {
  throw new Error('Container #app is not present, cannot render app.\\nEnsure to have a container with ID "id" in the root layout.')
}

hydrate(h(Page, { ...window.__pp }), container)
  `.trim()
}
