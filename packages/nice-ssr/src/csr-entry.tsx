import { createRef, StrictMode, type ReactNode, type RefObject } from 'react'
import { hydrateRoot } from 'react-dom/client'
import RootLayout from 'virtual:csr:root-layout'
import type { PartialPageRenderResult } from './entry/page-render.js'
import { SsrRouterProvider } from './nice-ssr/navigation.js'

export default async function start({
  a: pageModulePath,
  c: context,
  p: props,
}: PartialPageRenderResult) {
  try {
    if (!pageModulePath) {
      throw new Error('BUG: cannot find page module in server-provided assets')
    }

    const { renderPage: Page } = await import(/* @vite-ignore */ pageModulePath) as { renderPage: (props: Record<string, unknown>) => ReactNode }
    const rootRef = createRef<ReturnType<typeof hydrateRoot>>()
    const tree = (
      <StrictMode>
        <SsrRouterProvider
          initialValue={{
            ...context,
            url: new URL(context.url),
            pageModulePath,
            RootLayout,
            client: {
              root: rootRef as RefObject<ReturnType<typeof hydrateRoot>>,
            },
          }}
        >
          <Page {...props} />
        </SsrRouterProvider>
      </StrictMode>
    )
    rootRef.current = hydrateRoot(document, tree)
  } catch (e) {
    console.error('Error hydrating page', e)
  }
}
