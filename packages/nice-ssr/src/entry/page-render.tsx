/* eslint-disable react/jsx-key */
import path from 'node:path'
import { Readable } from 'node:stream'
import type { ComponentChild, VNode } from 'preact'
import { renderToReadableStream } from 'preact-render-to-string/stream'
// eslint-disable-next-line import-x/no-unresolved
import routeModules from 'virtual:ssr/routes'
import { SsrRouterContext, type SsrRouterContextValue } from '../nice-ssr/navigation'
import type { PageLoaderContext, PageModule } from '../nice-ssr/page'
import type { SsrRequest } from '../nice-ssr/request'
import { SsrResponse } from '../nice-ssr/response'

async function loadProps({ loader }: PageModule, context: PageLoaderContext) {
  const props = loader?.(context) ?? {}
  return props
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
): Promise<[ComponentChild[], ComponentChild[]]> {
  if (import.meta.env.DEV) {
    const pageCsrModuleId = path.join('virtual:csr', moduleId).replace(/\/$/, '')
    return [
      [<script type="module" nonce={scriptNonce} src="/src/app/root-layout.tsx" />],
      [<script type="module" nonce={scriptNonce} src={`/@id/__x00__${pageCsrModuleId}`} />],
    ]
  }

  // @ts-expect-error this is an external file after build
  // eslint-disable-next-line import-x/no-unresolved
  const { default: manifest } = await import('../client/.vite/manifest.json', { with: { type: 'json' } }) as { default: Record<string, RawManifestEntry> }
  const pageCsrModuleId = path.join('virtual:csr', moduleId).replace(/\/$/, '')
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
  ]))
  return [
    [
      ...css.map((entry) => <link rel="stylesheet" crossOrigin="anonymous" nonce={styleNonce} href={`${basePath}${entry}`} />),
      ...preloadScripts.map((entry) => <link rel="preload" crossOrigin="anonymous" nonce={scriptNonce} href={`${basePath}${entry.file}`} as="script" />),
    ],
    [
      <script type="module" crossOrigin="anonymous" nonce={scriptNonce} src={`${basePath}${pageCsrManifestEntry.file}`} />,
    ],
  ]
}

const DefaultRootLayout = ({ children }: { readonly children: ComponentChild[] }) => (
  <html lang="en">
    <head />
    <body id="app">{children}</body>
  </html>
)
const doctypeHtmlBuffer = Buffer.from('<!DOCTYPE html>\n', 'utf-8')

export default async function renderPage(module: PageModule, request: SsrRequest) {
  if (!request.headers.get('accept')?.includes('text/html')) {
    request.nice.log.debug('Page request but does not accept HTML, return 404')
    return new Response(null, { status: 404 })
  }

  request.nice.log.debug('Loading props')
  const ssrProps = await loadProps(module, request)

  request.nice.log.debug('Serializing data')
  const serializedProps = JSON.stringify(ssrProps)
  const context = {
    basePath: request.nice.basePath,
    params: request.nice.params,
    pathname: request.nice.pathname,
    url: request.nice.url,
  } satisfies SsrRouterContextValue
  const serializedContext = JSON.stringify(context)

  request.nice.log.debug('Building head')
  const scriptNonce = request.headers.get('x-script-nonce') || undefined
  const styleNonce = request.headers.get('x-style-nonce') || undefined
  const [[moreHeads, inBody], pageMetadataHead] = await Promise.all([
    getCsrTags(
      request.nice.originalPathname,
      request.nice.basePath,
      scriptNonce,
      styleNonce,
    ),
    renderHead(module, ssrProps),
  ])

  request.nice.log.debug('Building body')
  const RootLayout = (await routeModules.find((m) => m.type === 'root-layout')?.entry())?.default
    ?? DefaultRootLayout
  const { default: Page } = module
  const tree = RootLayout({
    children: [
      <SsrRouterContext value={context}>
        <Page {...ssrProps} />
      </SsrRouterContext>,
      <script
        type="module"
        nonce={scriptNonce}
        dangerouslySetInnerHTML={{
          __html: [
            'const f=(o)=>o==null||typeof o!=="object"?o:(Object.keys(o).forEach(k=>f(o[k])),Object.freeze(o))',
          `window.__pp=f(${serializedProps})`,
          `window.__cc=f(${serializedContext})`,
          ].join(';'),
        }}
      />,
      ...inBody,
    ],
  }) as VNode
  transformTree(tree, [...pageMetadataHead, ...moreHeads])

  request.nice.log.debug('Rendering HTML')
  const stream = Readable.fromWeb(
    // mixed types: DOM vs node -> cast to node's
    renderToReadableStream(tree) as import('node:stream/web').ReadableStream,
  )
  const body = Readable.from((async function * () {
    yield doctypeHtmlBuffer
    for await (const chunk of stream) {
      yield chunk
    }
  })())
  return SsrResponse.new()
    .header('content-type', 'text/html; charset=utf-8')
    .stream(body)
}

async function renderHead({ metadata: metadataFn }: PageModule, ssrProps: Record<string, unknown>) {
  const headEntries: ComponentChild[] = []
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
}

function transformTree(tree: VNode, additionalElements: ComponentChild[]) {
  if (tree.type !== 'html' || !Array.isArray(tree.props.children)) {
    throw new Error('The root layout must return <html /> tag')
  }

  let headTree = (tree.props.children as ComponentChild[])
    .filter((el): el is VNode => el != null && typeof el === 'object' && 'type' in el && 'props' in el)
    .find((el) => el.type === 'head')
  if (!headTree) {
    headTree = <head />
    tree.props.children.unshift(headTree)
  }
  headTree.props.children ??= []
  const headChildren = headTree.props.children as ComponentChild[]
  if (import.meta.env.DEV) {
    headChildren.unshift(<script type="module" src="/@vite/client" />)
  }
  headChildren.unshift(<meta charset="UTF-8" />)
  headChildren.push(...additionalElements)
}
