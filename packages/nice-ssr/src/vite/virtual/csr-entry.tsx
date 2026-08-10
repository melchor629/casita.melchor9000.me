import { StrictMode, type ReactNode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import type { PartialPageRenderResult } from '../../entry/page-render.js'
import { SsrRouterProvider } from '../../nice-ssr/navigation.js'

export default async function start({
  a: pageModulePath,
  c: context,
  p: props,
}: PartialPageRenderResult) {
  try {
    if (!pageModulePath) {
      throw new Error('BUG: cannot find page module in server-provided assets')
    }

    const { renderPage } = await import(/* @vite-ignore */ pageModulePath) as { renderPage: (props: Record<string, unknown>) => ReactNode }
    const tree = (
      <StrictMode>
        <SsrRouterProvider
          initialValue={{
            ...context,
            url: new URL(context.url),
          }}
          initialPage={renderPage(props)}
        />
      </StrictMode>
    )
    hydrateRoot(document, tree)
  } catch (e) {
    console.error('Error hydrating page', e)
  }
}
