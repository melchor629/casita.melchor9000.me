import { StrictMode, type ReactNode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import type { PartialPageRenderResult } from './entry/page-render.js'
import { SsrRouterProvider } from './nice-ssr/navigation.js'

export default async function start({
  a: [{ path }],
  c: context,
  p: props,
}: PartialPageRenderResult) {
  const container = document.getElementById('app')
  if (container == null) {
    throw new Error('Container #app is not present, cannot render app.\nEnsure to have a container with ID "id" in the root layout.')
  }

  try {
    const mod = await import(/* @vite-ignore */ path) as { renderPage: (props: Record<string, unknown>) => ReactNode }
    if (!mod.renderPage) return
    const tree = (
      <StrictMode>
        <SsrRouterProvider
          initialValue={{
            ...context,
            url: new URL(context.url),
            Page: mod.renderPage,
            pageModulePath: path,
            props,
          }}
        />
      </StrictMode>
    )
    hydrateRoot(container, tree)
  } catch (e) {
    console.error('Error hydrating page', e)
  }
}
