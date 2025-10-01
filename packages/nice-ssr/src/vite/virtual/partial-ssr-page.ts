import { getAppPath } from '../utils.ts'

export default function generatePartialSsrPage(moduleId: string) {
  const sourcePath = getAppPath(...moduleId.split('/'), 'page.tsx')
  return `
import { render, h } from 'preact'
import Page from ${JSON.stringify(sourcePath)}

const container = document.getElementById('app')
if (container == null) {
  throw new Error('Container #app is not present, cannot render app.\\nEnsure to have a container with ID "id" in the root layout.')
}

export default async function rerender(props) {
  render(h(Page, props), container)
}
  `.trim()
}
