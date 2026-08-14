import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
// eslint-disable-next-line import-x/no-unresolved
import { getRouteModulePath, type PagePathModule } from 'virtual:ssr/routes'
import type { PartialPageRenderResult } from '../../entry/page-render.js'
import ErrorBoundary, { type CsrError } from '../../nice-ssr/error.js'
import { SsrRouterProvider } from '../../nice-ssr/navigation.js'

function getRouteModule(path: string, type: 'page' | 'error' | 'not-found') {
  if (type === 'page') {
    const routeModulePath = getRouteModulePath(path, 'page')
    if (!routeModulePath) {
      throw new Error('BUG: cannot find page module in server-provided assets')
    }

    return routeModulePath
  }

  return getRouteModulePath(path, type)
}

async function renderPage(path: string, type: 'page' | 'error' | 'not-found', props: Record<string, unknown>) {
  const routes = getRouteModule(path, type)
  const routeModule = routes[routes.length - 1] as PagePathModule
  const [{ default: Page }, { default: Error }, ...layouts] = await Promise.all([
    routeModule.entry(),
    (getRouteModule(path, 'error').at(-1)! as PagePathModule).entry(),
    ...routes
      .toReversed()
      .filter((p) => p.layout != null)
      .map((p) => p.layout!().then((m) => m.default)),
  ])
  return layouts.reduce(
    (children, Layout) => <Layout>{children}</Layout>,
    <ErrorBoundary component={Error} error={type === 'error' ? props.error as CsrError : undefined}>
      <Page {...props} />
    </ErrorBoundary>,
  )
}

export default async function start({
  c: context,
  p: props,
  t: pageType,
}: PartialPageRenderResult) {
  try {
    const tree = (
      <StrictMode>
        <SsrRouterProvider
          initialValue={{
            ...context,
            url: new URL(context.url),
            client: {
              renderPage,
            },
          }}
          initialPage={await renderPage(context.pathname, pageType, props)}
        />
      </StrictMode>
    )
    hydrateRoot(document, tree)
  } catch (e) {
    console.error('Error hydrating page', e)
  }
}
