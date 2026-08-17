import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ComponentPropsWithRef,
  type FC,
  type MouseEventHandler,
  type ReactNode,
} from 'react'
import { preinit, preload, preloadModule, type PreloadAs } from 'react-dom'
import { createStore, useStore } from 'zustand'
import { useShallow } from 'zustand/shallow'
import type { PartialPageRenderResult } from '../entry/page-render'
import type { Metadata } from './page'
import RootLayout from './root-layout'

const ssrTypeSymbol: unique symbol = Symbol('ssr:type')

export class SsrError extends Error {
  readonly [ssrTypeSymbol]: 'redirect' | 'not-found'

  constructor(type: SsrError[typeof ssrTypeSymbol], message?: string, options?: ErrorOptions) {
    super(message, options)
    this[ssrTypeSymbol] = type
  }
}

export const isSsrError = (error: unknown): error is SsrError =>
  error instanceof SsrError || (error instanceof Error && ssrTypeSymbol in error)

export const getSsrErrorType = (error: SsrError): SsrError[typeof ssrTypeSymbol] =>
  error[ssrTypeSymbol]

/**
 * Redirects the request to another path or URL. Use this only
 * inside a loader function.
 * @param path New path to redirect the page to.
 */
export function redirect(path: string): never {
  if (!import.meta.env.SSR) throw new Error('Only use in loader() function')

  throw new SsrError('redirect', path)
}

/**
 * Cuts the request and marks the response as not found. Use
 * this only inside a loader function, route handler or middleware.
 * The response will be the not found page. For returning other body,
 * use `SsrResponse` in route handler or middleware.
 */
export function notFound(): never {
  if (!import.meta.env.SSR) throw new Error('Only use in loader() function')

  throw new SsrError('not-found')
}

type Blocker = Readonly<{
  /**
   * The state of the blocker.
   */
  state: 'unblocked'
} | {
  /**
   * The state of the blocker.
   */
  state: 'blocked'
  /**
   * URL where it will navigate to.
   */
  location: URL
  /**
   * Proceeds with the navigation.
   */
  proceed: () => void
  /**
   * Resets the navigation by canceling it.
   */
  reset: () => void
} | {
  /**
   * The state of the blocker.
   */
  state: 'proceeding'
  /**
   * URL that is navigating to.
   */
  location: URL
}>

type BlockerFn = (newUrl: URL, result: Promise<'proceed' | 'block'>) => Promise<'proceed' | 'block'>

type RouterContextState = Readonly<SsrRouterProviderProps & {
  state: 'inactive' | 'navigating'
  blockerFns: ReadonlyArray<BlockerFn>
}>

type RouterContextActions = Readonly<{
  getState: () => RouterContextState
  setState: (value: Partial<RouterContextState> | ((current: RouterContextState) => Partial<RouterContextState>)) => void

  appendBlockerFn: (fn: BlockerFn) => void
  removeBlockerFn: (fn: BlockerFn) => void
  removeAllBlockerFns: () => void

  changeUrl(newUrl: URL): void
  loadPage(newUrl: URL, justFetch?: boolean): Promise<void>
}>

export type SsrRouteAsset = Readonly<{
  type: 'style' | 'module' | 'modulepreload'
  path: string
} | {
  type: 'preload'
  path: string
  as: PreloadAs
}>

export type SsrRouterProviderProps = Readonly<{
  url: URL
  basePath: string
  pathname: string
  params: Record<string, string>
  server?: {
    assets: SsrRouteAsset[]
    nonce: { style?: string, script?: string }
  }
  client?: {
    renderPage: (
      path: string,
      type: 'page' | 'error' | 'not-found',
      props: Record<string, unknown>,
    ) => Promise<ReactNode>
  }
  metadata: Metadata
}>

export const SsrRouterContext = createContext<{
  store: ReturnType<ReturnType<typeof createStore<RouterContextState>>>
  isTransitioning: boolean
  actions: RouterContextActions
}>(null!)
SsrRouterContext.displayName = 'SsrRouterContext'

const useRouterContext = () => useContext(SsrRouterContext)

export function useRouterContextState<S>(fn: (state: RouterContextState) => S) {
  const store = useRouterContext()
  const state = useStore(store.store, useShallow(fn))
  return state
}

const getHref = (currentUrl: URL, pathname?: string, searchParams?: URLSearchParams) => {
  if (pathname && !pathname.startsWith('/')) {
    throw new Error('Only absolute paths are supported')
  }

  return `${pathname ?? currentUrl.pathname}?${searchParams ?? ''}`.replace(/\?$/, '')
}

const loadPage = async (store: RouterContextActions, newUrl: URL, justFetch = false) => {
  const { renderPage } = store.getState().client ?? {}
  if (!renderPage) {
    throw new Error('This API is client-only')
  }

  store.setState({ state: 'navigating' })
  const res = await fetch(newUrl, {
    headers: {
      accept: 'application/json+ssr',
    },
  })
  const data = await res.json() as PartialPageRenderResult
  if (!justFetch) {
    store.setState({ ...data.c, url: new URL(data.c.url) })
  }

  return renderPage(data.c.pathname, data.t, data.p)
}

const trySmoothNavigation = async (actions: RouterContextActions, newUrl: URL) => {
  if (newUrl.pathname !== actions.getState().pathname) {
    try {
      const { promise: blockerResult, resolve } = Promise.withResolvers<'block' | 'proceed'>()
      const { blockerFns } = actions.getState()
      const blockersResults = await Promise.all(blockerFns.map((fn) => fn(newUrl, blockerResult)))
      if (blockersResults.includes('block')) {
        resolve('block')
        return 'block'
      }
      resolve('proceed')
      await actions.loadPage(newUrl)
    } catch {
      location.assign(newUrl)
      return 'block'
    }
  } else {
    actions.changeUrl(newUrl)
  }
  return 'proceed'
}

/**
 * Allows blocking navigation if the condition in {@link shouldBlock} matches. When it is blocked,
 * the blocker object will have `state === 'blocked'` and one of the `proceed` or `reset` functions
 * must be called to continue or cancel the navigation. When the state is `state === 'proceeding'`,
 * the navigation is taking place right now.
 * @param shouldBlock A boolean or function that returns a boolean which decides if the navigation should be blocked.
 * @returns The blocker interface.
 */
export const useBlocker = (shouldBlock: boolean | ((opts: { current: URL, next: URL }) => boolean)): Blocker => {
  const { actions } = useRouterContext()
  const [blockerState, setBlockerState] = useState<Blocker>({ state: 'unblocked' })

  useEffect(() => {
    let navFn: (() => void) | null = null
    const fn = (newUrl: URL, result: Promise<'proceed' | 'block'>) => {
      if (shouldBlock === false) {
        return Promise.resolve<'proceed'>('proceed')
      }
      if (typeof shouldBlock === 'function' && !shouldBlock({ current: actions.getState().url, next: newUrl })) {
        return Promise.resolve<'proceed'>('proceed')
      }

      const { promise, resolve } = Promise.withResolvers<'proceed' | 'block'>()
      setBlockerState({
        state: 'blocked',
        location: newUrl,
        proceed: () => resolve('proceed'),
        reset: () => resolve('block'),
      })
      result
        .then((result) => {
          if (result === 'proceed') {
            setBlockerState({ state: 'proceeding', location: newUrl })
            navFn = () => {
              navFn = null
              setBlockerState({ state: 'unblocked' })
            }
          } else {
            setBlockerState({ state: 'unblocked' })
          }
        })
        .catch(() => {})
      return promise
    }
    actions.appendBlockerFn(fn)
    return () => {
      actions.removeBlockerFn(fn)
      if (navFn) {
        navFn = null
      }
    }
  }, [actions, shouldBlock])

  return blockerState
}

/**
 * Calculates the `href` of the provided path.
 * @param path The path to get the URL.
 * @returns The resolved href.
 */
export const useHref = (path: string | { pathname?: string, searchParams?: URLSearchParams }): string => {
  const url = useRouterContextState(useCallback((state) => state.url, []))
  return useMemo(
    () =>
      typeof path === 'string'
        ? getHref(url, path)
        : getHref(url, path.pathname, path.searchParams),
    [path, url],
  )
}

/**
 * Gets the pathname of the current page. The pathname does not include
 * search parameters nor hash.
 * @returns The pathname of the current page.
 */
export const usePathname = (): string => useRouterContextState(useCallback((state) => state.pathname, []))

/**
 * Gets the search parameters parsed as {@link URLSearchParams} instance.
 * Any modifications on the object won't be reflected back, please use
 * {@link useNavigate} function instead.
 * @returns The search parameters of the current page.
 */
export const useSearchParams = (): URLSearchParams =>
  useRouterContextState(useCallback((state) => state.url.searchParams, []))

/**
 * Gets the route parameters for the given page based on the template
 * defined for this page path.
 * @returns The route parameters.
 */
export const useParams = <T extends Record<string, string>>(): T =>
  useRouterContextState(useCallback((state) => state.params as T, []))

/**
 * Gets a function that navigates the page to the new path.
 * @returns A function to navigate in the app.
 */
export const useNavigate = (): (path: string | { pathname?: string, searchParams?: URLSearchParams }, mode?: 'replace' | 'push') => void => {
  const { actions } = useRouterContext()
  return useMemo(() => (path, mode = 'push') => {
    const { url } = actions.getState()
    const { origin } = url
    if (typeof path === 'string') {
      const a = new URL(path, origin)
      path = { pathname: a.pathname, searchParams: a.searchParams }
    }

    const newUrl = new URL(
      `${path.pathname ?? url.pathname}?${path.searchParams ?? ''}`.replace(/\?$/, ''),
      origin,
    )
    if (import.meta.env.SSR) {
      redirect(newUrl.toString())
    }
    trySmoothNavigation(actions, newUrl)
      .then((result) => {
        if (result === 'proceed') {
          navigation.navigate(newUrl, { info: ssrTypeSymbol, history: mode })
        }
      })
      .catch(() => {})
  }, [actions])
}

/**
 * Gets the navigation status. If inactive, nothing is doing in the background. If navigating,
 * the system is loading the next page.
 * @returns The current navigation status.
 */
export const useNavigationStatus = (): RouterContextState['state'] => {
  const status = useRouterContextState(useCallback((state) => state.state, []))
  const { isTransitioning } = useRouterContext()
  return isTransitioning ? 'navigating' : status
}

/**
 * Gets a function to force reload loader data when requested.
 * @returns A function to call when a data revalidation is needed.
 */
export const useRevalidator = (): () => Promise<void> => {
  const { actions } = useRouterContext()
  const { state, url } = useRouterContextState(useCallback((s) => ({ state: s.state, url: s.url }), []))
  return useCallback(() => {
    if (state === 'inactive') return actions.loadPage(url, true)
    return Promise.reject(new Error('Cannot revalidate while loding another page or already revalidating'))
  }, [actions, state, url])
}

export type LinkProps = Readonly<Omit<ComponentPropsWithRef<'a'>, 'href'> & {
  /**
   * The path to navigate to. Only absolute paths are supported.
   */
  to: string | { pathname?: string, searchParams?: URLSearchParams, mode?: 'push' | 'replace' }
}>

export const Link: FC<LinkProps> = ({ children, onClick, to, ...props }: LinkProps) => {
  const navigate = useNavigate()
  const href = useHref(to)

  const improvedClick = useCallback<MouseEventHandler<HTMLAnchorElement>>((e) => {
    e.preventDefault()
    navigate(to, typeof to === 'object' ? to.mode : 'push')
    onClick?.(e)
  }, [to, onClick, navigate])

  return (
    <a
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      onClick={improvedClick}
      href={href}
    >
      {children}
    </a>
  )
}

export const RenderHead = () => {
  const server = useRouterContextState(useCallback((e) => e.server, []))
  const metadata = useRouterContextState(useCallback((e) => e.metadata, []))

  if (server) {
    const { assets, nonce } = server
    assets.forEach((asset) => {
      if (asset.type === 'modulepreload') {
        preloadModule(asset.path, { as: 'script', nonce: nonce.script, crossOrigin: 'anonymous' })
      }

      if (asset.type === 'preload') {
        preload(asset.path, { as: asset.as, crossOrigin: 'anonymous' })
      }

      if (asset.type === 'style') {
        preinit(asset.path, { as: 'style', crossOrigin: 'anonymous', nonce: nonce.style })
      }
    })
  }

  return (
    <>
      <meta key="utf8" charSet="UTF-8" />

      {metadata.title && <title>{metadata.title}</title>}
      {metadata.description && <meta name="description" content={metadata.description} />}
      {metadata.baseHref && <base href={metadata.baseHref} />}
    </>
  )
}

export const RenderScripts = () => {
  return null
}

export function SsrRouterProvider({ initialPage, initialValue }: Readonly<{
  initialPage: ReactNode
  initialValue: SsrRouterProviderProps
}>) {
  const store = useMemo(() => createStore<RouterContextState>()(() => ({
    basePath: initialValue.basePath,
    blockerFns: [],
    params: initialValue.params,
    pathname: initialValue.pathname,
    state: 'inactive',
    url: initialValue.url,
    server: initialValue.server,
    metadata: initialValue.metadata,
    client: initialValue.client,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [])
  const [loadPagePromise, setLoadPagePromise] = useState<Promise<ReactNode> | null>(null)
  const [isTransitioning, startTransition] = useTransition()

  const actions = useMemo((): RouterContextActions => ({
    getState: () => store.getState(),
    setState: (vfn) => store.setState((v) => {
      const result = typeof vfn === 'function' ? vfn(v) : vfn
      return { ...result }
    }),
    appendBlockerFn: (fn) => store.setState((v) => ({ blockerFns: [...v.blockerFns, fn] })),
    removeAllBlockerFns: () => store.setState({ blockerFns: [] }),
    removeBlockerFn: (fn) => store.setState((v) => {
      const idx = v.blockerFns.indexOf(fn)
      return idx >= 0
        ? {
            blockerFns: v.blockerFns.toSpliced(idx, 1),
          }
        : {}
    }),
    changeUrl(newUrl) {
      startTransition(() => store.setState({ url: newUrl }))
    },
    async loadPage(newUrl, justFetch = false) {
      const pagePromise = loadPage(this, newUrl, justFetch)
      startTransition(() => {
        store.setState({ state: 'navigating' })
        setLoadPagePromise(pagePromise)
      })
      await pagePromise.finally(() => store.setState({ state: 'inactive' }))
    },
  }), [store])

  useEffect(() => {
    if (import.meta.env.SSR) {
      return () => {}
    }

    const abort = new AbortController()
    navigation.addEventListener('navigate', (e) => {
      if (!e.canIntercept || e.navigationType === 'reload' || e.downloadRequest || e.formData) return
      if (e.navigationType !== 'traverse' && e.info === ssrTypeSymbol) {
        return e.intercept()
      }

      const newUrl = new URL(e.destination.url, location.origin)
      e.intercept({
        async handler() {
          await trySmoothNavigation(actions, newUrl)
            .then((result) => {
              if (result === 'proceed') e.scroll()
              else e.preventDefault()
            })
            .catch(() => window.location.reload())
        },
      })
    }, {
      passive: false,
      signal: abort.signal,
    })
    return () => abort.abort()
  }, [actions])

  const pageElement = loadPagePromise ? use(loadPagePromise) : initialPage
  return (
    <SsrRouterContext
      value={{
        actions,
        store,
        isTransitioning,
      }}
    >
      <RootLayout>
        {pageElement}
      </RootLayout>
    </SsrRouterContext>
  )
}
