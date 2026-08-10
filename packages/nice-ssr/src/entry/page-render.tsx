import path from 'node:path'
import type { PreloadAs } from 'react-dom'
import { renderToReadableStream } from 'react-dom/server'
import { SsrRouterProvider, type SsrRouteAsset, type SsrRouterProviderProps } from '../nice-ssr/navigation'
import type { PageHelperModule, PageLoaderContext, PageModule } from '../nice-ssr/page'
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
  assets?: string[]
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

const getAllAssets = (entry: ManifestEntry): string[] => [
  ...(entry.assets ?? []),
  ...(entry.imports?.map((n) => getAllAssets(n)) ?? []),
  ...(entry.dynamicImports?.map((n) => getAllAssets(n)) ?? []),
].flat()

const getAllStyles = (entry: ManifestEntry): string[] => [
  ...(entry.css ?? []),
  ...(entry.imports?.map((n) => getAllStyles(n)) ?? []),
  ...(entry.dynamicImports?.map((n) => getAllStyles(n)) ?? []),
].flat()

const imageTypes = ['.png', '.jpg', '.jpeg', '.jfif', '.webp', '.avif', '.heif', '.heic', '.ico']
const fontTypes = ['.woff', '.woff2', '.ttf', '.otf']
const mapExtToPreloadAs = (name: string): PreloadAs => {
  if (name.endsWith('.js')) return 'script'
  if (name.endsWith('.css')) return 'style'
  if (imageTypes.some((ext) => name.endsWith(ext))) return 'image'
  if (fontTypes.some((ext) => name.endsWith(ext))) return 'font'
  return 'fetch'
}

async function getCsrAssets(
  moduleId: string,
  basePath: string,
): Promise<SsrRouteAsset[]> {
  const pageCsrModuleId = path.join('virtual:csr', moduleId).replace(/\/$/, '')
  if (import.meta.env.DEV) {
    return [
      { type: 'module', path: '/@vite/client' },
      { type: 'module', path: '/@id/__x00__@vitejs/plugin-react/preamble' },
      { type: 'pagemodule', path: `/@id/__x00__${pageCsrModuleId}` },
    ]
  }

  // @ts-expect-error this is an external file after build
  // eslint-disable-next-line import-x/no-unresolved
  const { default: manifest } = await import('../client/.vite/manifest.json', { with: { type: 'json' } }) as { default: Record<string, RawManifestEntry> }
  const pageCsrManifestEntry = getEntryForModuleId(manifest, pageCsrModuleId)
  const allDependencyEntries = getExtraEntries(pageCsrManifestEntry)
  const css = Array.from(new Set(getAllStyles(pageCsrManifestEntry)))
  const preloadScripts = Array.from(new Set([
    ...allDependencyEntries.flatMap((entry) => entry?.imports ?? []),
    ...allDependencyEntries.flatMap((entry) => entry?.dynamicImports ?? []),
    pageCsrManifestEntry,
  ].map((entry) => entry.file)))
  const assets = Array.from(new Set(getAllAssets(pageCsrManifestEntry)))
  return [
    ...css.map((entry): SsrRouteAsset => ({ type: 'style', path: `${basePath}${entry}` })),
    ...preloadScripts.map((entry): SsrRouteAsset => ({ type: 'modulepreload', path: `${basePath}${entry}` })),
    ...assets.map((path): SsrRouteAsset => ({
      type: 'preload',
      path: `${basePath}${path}`,
      as: mapExtToPreloadAs(path),
    })),
    { type: 'pagemodule', path: `${basePath}${pageCsrManifestEntry.file}` },
  ]
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
  const [assets, pageMetadataHead, entryScriptPath] = await Promise.all([
    getCsrAssets(
      request.nice.originalPathname,
      request.nice.basePath,
    ),
    generateMetadata(module, ssrProps),
    getEntryCsr(request.nice.basePath),
  ])

  request.nice.log.debug('Building body')
  const tree = await startSpan('render page', async () => {
    const { default: Page } = module
    const layoutComponents = await Promise.all(pageContext.layouts.map(async (m) => (await m()).default))
    const tree = (
      <SsrRouterProvider
        key="router-provider"
        initialValue={{
          basePath: request.nice.basePath,
          params: request.nice.params,
          pathname: request.nice.pathname,
          url: request.nice.url,
          pageModulePath: '',
          server: {
            assets,
            nonce: { script: scriptNonce, style: styleNonce },
          },
          metadata: pageMetadataHead,
        }}
      >
        <>
          {layoutComponents.reduceRight(
            (p, Layout) => <Layout>{p}</Layout>,
            <Page {...ssrProps} />,
          )}
        </>
      </SsrRouterProvider>
    )
    return tree
  })

  request.nice.log.debug('Rendering HTML')
  const serializableContext: PartialPageRenderResult = {
    a: assets.find((e) => e.type === 'pagemodule')?.path,
    c: {
      basePath: request.nice.basePath,
      params: request.nice.params,
      pathname: request.nice.pathname,
      url: request.nice.url,
      metadata: pageMetadataHead,
    },
    p: ssrProps,
  }
  const stream = await renderToReadableStream(tree, {
    nonce: scriptNonce,
    signal: request.signal,
    bootstrapModules: assets.filter((a) => a.type === 'module').map((a) => a.path),
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
  a: string | undefined
  p: Record<string, unknown>
  c: Omit<SsrRouterProviderProps, 'props' | 'Page' | 'pageModulePath' | 'RootLayout'>
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

  request.nice.log.debug('Building head')
  const [assets, metadata] = await Promise.all([
    getCsrAssets(
      request.nice.originalPathname,
      request.nice.basePath,
    ),
    generateMetadata(module, ssrProps),
  ])

  const context = {
    basePath: request.nice.basePath,
    params: request.nice.params,
    pathname: request.nice.pathname,
    url: request.nice.url,
    metadata,
    server: {
      assets,
      nonce: {},
    },
  } satisfies PartialPageRenderResult['c']

  request.nice.log.debug('Generting response')
  return SsrResponse.json({
    p: ssrProps,
    c: context,
    a: assets.find((a) => a.type === 'pagemodule')?.path,
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

async function generateMetadata({ metadata: metadataFn }: PageModule, ssrProps: Record<string, unknown>) {
  return startSpan('prepare metadata', async () => {
    const metadata = typeof metadataFn === 'function' ? await metadataFn(ssrProps) : metadataFn
    return metadata ?? {}
  })
}
