import { getAppPath } from '../utils.ts'

export default function generateCsrPage(moduleId: string, devtools: 'none' | 'dev' | 'prod') {
  const sourcePath = getAppPath(...moduleId.split('/'), 'page.tsx')
  const devtoolsImport = `import "${devtools === 'prod' ? 'preact/devtools' : 'preact/debug'}";`
  return `
${devtools !== 'none' ? devtoolsImport : ''}
import { hydrate, h, options } from 'preact'
import Page from ${JSON.stringify(sourcePath)}

const container = document.getElementById('app')
if (container == null) {
  throw new Error('Container #app is not present, cannot render app.\\nEnsure to have a container with ID "id" in the root layout.')
}

hydrate(h(Page, { ...window.__pp }), container)
  `.trim()
}
