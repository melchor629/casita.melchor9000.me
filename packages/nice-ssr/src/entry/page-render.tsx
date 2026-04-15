/* eslint-disable react/jsx-key */
import path from 'node:path'
import { type ReactNode, type ReactElement, cloneElement, type ComponentProps } from 'react'
import { renderToReadableStream } from 'react-dom/server'
// eslint-disable-next-line import-x/no-unresolved
import routeModules from 'virtual:ssr/routes'
import { SsrRouterProvider, type SsrRouterProviderProps } from '../nice-ssr/navigation'
import type { Metadata, PageHelperModule, PageLoaderContext, PageModule } from '../nice-ssr/page'
import type { SsrRequest } from '../nice-ssr/request'
import { SsrResponse } from '../nice-ssr/response'
import { startSpan } from './tracer'

async function loadProps({ loader }: PageModule, context: PageLoaderContext) {
  return startSpan('run page loader', async () => {
    const props = (await loader?.(context)) ?? {}
    return props
  })
}

type ManifestEntry = {
  file: string
  name?: string
  src?: string
  imports?: ManifestEntry[]
  dynamicImports?: ManifestEntry[]
  isDynamicEntry?: boolean
  isEntry?: boolean
  css?: string[]
}

type RawManifestEntry = Omit<ManifestEntry, 'imports' | 'dynamicImports'> & {
  dynamicImports?: string[]
  imports?: string[]
}

const unsafeCharMap: Record<string, string> = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\\': '\\\\',
  '\b': '\\b',
  '\f': '\\f',
  '\n': '\\n',
  '\r': '\\r',
  '\t': '\\t',
  '\0': '\\0',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029',
}
const serializeForHtml = (data: unknown) => {
  const json = JSON.stringify(data, (_, value) => {
    if (typeof value === 'function') {
      throw new Error('Cannot serialize functions')
    }
    if (typeof value === 'bigint') {
      return value.toString()
    }
    return value as unknown
  })
  // eslint-disable-next-line no-control-regex
  return json.replace(/[<>\u0008\f\n\r\t\0\u2028\u2029]/g, x => unsafeCharMap[x])
}

function getEntryForModuleId(manifest: Record<string, RawManifestEntry>, moduleId: string): ManifestEntry {
  if (!(moduleId in manifest)) {
    return null!
  }

  const entry = manifest[moduleId]
  return {
    ...entry,
    imports: entry.imports
      ? entry.imports.map(getEntryForModuleId.bind(null, manifest))
      : undefined,
    dynamicImports: entry.dynamicImports
      ? entry.dynamicImports.map(getEntryForModuleId.bind(null, manifest))
      : undefined,
  }
}

const getExtraEntries = (entry: ManifestEntry): ManifestEntry[] => [
  entry,
  ...(entry.imports ?? []).flatMap(getExtraEntries),
  ...(entry.dynamicImports ?? []).flatMap(getExtraEntries),
]

async function getCsrTags(
  moduleId: string,
  basePath: string,
  scriptNonce?: string,
  styleNonce?: string,
): Promise<[ReactNode[], string]> {
  const pageCsrModuleId = path.join('virtual:csr', moduleId).replace(/\/$/, '')
  if (import.meta.env.DEV) {
    return [
      [
        <script key="vite" type="module" nonce={scriptNonce} src="/@vite/client" />,
        <script key="react-refresh" type="module" nonce={scriptNonce} src="/@id/__x00__@vitejs/plugin-react/preamble" />,
        <script key="root-layout" type="module" nonce={scriptNonce} src="/src/app/root-layout.tsx" />,
      ],
      `/@id/__x00__${pageCsrModuleId}`,
    ]
  }

  // @ts-expect-error this is an external file after build
  // eslint-disable-next-line import-x/no-unresolved
  const { default: manifest } = await import('../client/.vite/manifest.json', { with: { type: 'json' } }) as { default: Record<string, RawManifestEntry> }
  const pageCsrManifestEntry = getEntryForModuleId(manifest, pageCsrModuleId)
  const rootLayoutCsrManifestEntry = getEntryForModuleId(manifest, 'src/app/root-layout.tsx')
  const allDependencyEntries = getExtraEntries(pageCsrManifestEntry)
  const css = Array.from(new Set([
    ...(rootLayoutCsrManifestEntry?.css ?? []),
    ...allDependencyEntries.flatMap((entry) => entry.css ?? []),
  ]))
  const preloadScripts = Array.from(new Set([
    ...allDependencyEntries.flatMap((entry) => entry?.imports ?? []),
    ...allDependencyEntries.flatMap((entry) => entry?.dynamicImports ?? []),
    pageCsrManifestEntry,
  ]))
  return [
    [
      ...css.map((entry) => <link rel="stylesheet" crossOrigin="anonymous" nonce={styleNonce} href={`${basePath}${entry}`} />),
      ...preloadScripts.map((entry) => <link rel="preload" crossOrigin="anonymous" nonce={scriptNonce} href={`${basePath}${entry.file}`} as="script" />),
    ],
    `${basePath}${pageCsrManifestEntry.file}`,
  ]
}

async function getCsrAssets(
  moduleId: string,
  basePath: string,
): Promise<Array<{ type: 'page' | 'module' | 'stylesheet', path: string }>> {
  const pageCsrModuleId = path.join('virtual:csr', moduleId).replace(/\/$/, '')
  if (import.meta.env.DEV) {
    return [
      { type: 'page', path: `/@id/__x00__${pageCsrModuleId}` },
    ]
  }

  // @ts-expect-error this is an external file after build
  // eslint-disable-next-line import-x/no-unresolved
  const { default: manifest } = await import('../client/.vite/manifest.json', { with: { type: 'json' } }) as { default: Record<string, RawManifestEntry> }
  const pageCsrManifestEntry = getEntryForModuleId(manifest, pageCsrModuleId)
  const allDependencyEntries = getExtraEntries(pageCsrManifestEntry)
  const css = allDependencyEntries
    .flatMap((entry) => entry.css ?? [])
    .map((path) => ({ type: 'stylesheet' as const, path }))
  return [...css, { type: 'page', path: `${basePath}${pageCsrManifestEntry.file}` }]
}

async function getEntryCsr(basePath: string) {
  if (import.meta.env.DEV) {
    return '/@id/__x00__virtual:entry-csr'
  }

  // @ts-expect-error this is an external file after build
  // eslint-disable-next-line import-x/no-unresolved
  const { default: manifest } = await import('../client/.vite/manifest.json', { with: { type: 'json' } }) as { default: Record<string, RawManifestEntry> }
  const entry = getEntryForModuleId(manifest, 'virtual:entry-csr')
  return basePath + entry.file
}

const DefaultRootLayout = ({ children }: { readonly children: ReactNode[] }) => (
  <html lang="en">
    <head />
    <body id="app">{children}</body>
  </html>
)

async function renderCompletePage(
  module: PageModule,
  pageContext: RenderPageContext,
  request: SsrRequest,
) {
  request.nice.log.debug('Loading props')
  const ssrProps = {
    ...(await loadProps(module, request)),
    ...pageContext.props,
  }

  request.nice.log.debug('Building head')
  const scriptNonce = request.headers.get('x-script-nonce') || undefined
  const styleNonce = request.headers.get('x-style-nonce') || undefined
  const [[moreHeads, pageScriptPath], pageMetadataHead, entryScriptPath] = await Promise.all([
    getCsrTags(
      request.nice.originalPathname,
      request.nice.basePath,
      scriptNonce,
      styleNonce,
    ),
    renderHead(module, ssrProps),
    getEntryCsr(request.nice.basePath),
  ])

  request.nice.log.debug('Building body')
  const tree = await startSpan('render page', async () => {
    const RootLayout = (await routeModules.rootLayout?.())?.default
      ?? DefaultRootLayout
    const { default: Page } = module
    const layoutComponents = await Promise.all(pageContext.layouts.map(async (m) => (await m()).default))
    const tree = RootLayout({
      children: [
        <SsrRouterProvider
          key="router-provider"
          initialValue={{
            basePath: request.nice.basePath,
            params: request.nice.params,
            pathname: request.nice.pathname,
            url: request.nice.url,
            Page: (props: Record<string, unknown>) => (
              <>
                {layoutComponents.reduceRight(
                  // eslint-disable-next-line react/no-unstable-nested-components
                  (p, Layout) => <Layout>{p}</Layout>,
                  <Page {...props} />,
                )}
              </>
            ),
            pageModulePath: '',
            props: ssrProps,
          }}
        />,
      ],
    }) as ReactElement<ComponentProps<'html'>, 'html'>
    return transformTree(tree, [...pageMetadataHead, ...moreHeads])
  })

  request.nice.log.debug('Rendering HTML')
  const serializableContext: PartialPageRenderResult = {
    a: [{ type: 'page', path: pageScriptPath }],
    c: {
      basePath: request.nice.basePath,
      params: request.nice.params,
      pathname: request.nice.pathname,
      url: request.nice.url,
    },
    p: ssrProps,
  }
  const stream = await renderToReadableStream(tree, {
    nonce: scriptNonce,
    signal: request.signal,
    bootstrapScriptContent: `
      const c=${serializeForHtml(serializableContext)};
      import(${serializeForHtml(entryScriptPath)}).then(({ default: start }) => start(c));
    `,
    onError(error, errorInfo) {
      request.nice.log.error({ err: error, ...errorInfo }, 'Rendering page thrown an unhandled error')
    },
  })
  return SsrResponse.new()
    .header('content-type', 'text/html; charset=utf-8')
    .status(pageContext.status ?? 'ok')
    .stream(stream)
}

export type PartialPageRenderResult = Readonly<{
  p: Record<string, unknown>
  c: Omit<SsrRouterProviderProps, 'props' | 'Page' | 'pageModulePath'>
  a: Array<{ type: 'page' | 'module' | 'stylesheet', path: string }>
  m?: Metadata
}>

async function renderPartialPage(
  module: PageModule,
  pageContext: RenderPageContext,
  request: SsrRequest,
) {
  request.nice.log.debug('Loading props')
  const ssrProps = {
    ...(await loadProps(module, request)),
    ...pageContext.props,
  }

  request.nice.log.debug('Serializing data')
  const context = {
    basePath: request.nice.basePath,
    params: request.nice.params,
    pathname: request.nice.pathname,
    url: request.nice.url,
  } satisfies PartialPageRenderResult['c']

  request.nice.log.debug('Building head')
  const [assets, metadata] = await Promise.all([
    getCsrAssets(
      request.nice.originalPathname,
      request.nice.basePath,
    ),
    typeof module.metadata === 'function'
      ? module.metadata(ssrProps)
      : Promise.resolve(module.metadata),
  ])

  return SsrResponse.json({
    p: ssrProps,
    c: context,
    a: assets,
    m: metadata,
  } satisfies PartialPageRenderResult)
}

function renderInvalidPage(request: SsrRequest) {
  request.nice.log.debug('Page request but does not accept HTML, return 404')
  return new Response(null, { status: 404 })
}

type RenderPageContext = {
  layouts: Array<() => Promise<PageHelperModule>>
  status?: number
  props?: Record<string, unknown>
}

export default async function renderPage(
  module: PageModule,
  context: RenderPageContext,
  request: SsrRequest,
): Promise<Response> {
  const accept = request.headers.get('accept')
  if (accept?.includes('application/json+ssr')) {
    return renderPartialPage(module, context, request)
  }

  if (accept?.includes('text/html') || accept?.includes('*/*')) {
    return renderCompletePage(module, context, request)
  }

  return renderInvalidPage(request)
}

async function renderHead({ metadata: metadataFn }: PageModule, ssrProps: Record<string, unknown>) {
  return startSpan('prepare metadata', async () => {
    const headEntries: ReactNode[] = []
    const metadata = typeof metadataFn === 'function' ? await metadataFn(ssrProps) : metadataFn
    if (metadata?.title) {
      headEntries.push(<title>{metadata.title}</title>)
    }
    if (metadata?.description) {
      headEntries.push(<meta name="description" content={metadata.description} />)
    }
    if (metadata?.baseHref) {
      headEntries.push(<base href={metadata.baseHref} />)
    }
    return headEntries
  })
}

const keyFillTrick = (children: ReadonlyArray<ReactNode>): ReadonlyArray<ReactNode> =>
  Object.freeze(children.map((e, i) => typeof e === 'object' && e && 'type' in e ? ({ ...e, key: e.key ?? i.toString() } satisfies ReactElement) : e))
function transformTree(tree: ReactElement<ComponentProps<'html'>, 'html'>, additionalElements: ReactNode[]) {
  if (tree.type !== 'html' || !tree.props.children || typeof tree.props.children !== 'object' || !(Symbol.iterator in tree.props.children)) {
    throw new Error('The root layout must return <html /> tag')
  }

  const treeChildren = Array.from(tree.props.children)
  const headTree = treeChildren
    .filter((el): el is ReactElement => el != null && typeof el === 'object' && 'type' in el && 'props' in el)
    .find((el): el is ReactElement<ComponentProps<'head'>, 'head'> => el.type === 'head')
    ?? <head /> as ReactElement<ComponentProps<'head'>>
  const headChildren = Array.from(headTree.props.children as ReactNode[] ?? [])
  headChildren.unshift(<meta key="utf8" charSet="UTF-8" />)
  headChildren.push(...additionalElements)

  const newHead = cloneElement(headTree, {
    children: keyFillTrick(headChildren),
  })
  return cloneElement(tree, {
    children: keyFillTrick([
      treeChildren.slice(0, treeChildren.indexOf(headTree)),
      newHead,
      treeChildren.slice(treeChildren.indexOf(headTree) + 1),
    ]),
  })
}
