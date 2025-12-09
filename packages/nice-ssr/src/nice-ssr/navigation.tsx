import {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ComponentPropsWithRef,
  type FC,
  type MouseEventHandler,
  type ReactNode,
} from 'react'
import { useShallow } from 'zustand/shallow'
import type { PartialPageRenderResult } from '../entry/page-render'

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
  url: URL
  state: 'inactive' | 'navigating'
  blockerFns: ReadonlyArray<BlockerFn>
  pagePromise?: Promise<void>
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

export type SsrRouterProviderProps = Readonly<{
  url: URL
  basePath: string
  pathname: string
  params: Record<string, string>
  props: Record<string, unknown>
  Page: (props: Record<string, unknown>) => ReactNode
}>

const SsrRouterContext = createContext<{
  state: RouterContextState
  actions: RouterContextActions
}>(null!)
SsrRouterContext.displayName = 'SsrRouterContext'

const useRouterStore = () => useContext(SsrRouterContext)

function useRouterContext<S>(fn: (state: RouterContextState) => S) {
  const store = useRouterStore()
  return useShallow(fn)(store.state)
}

const getHref = (currentUrl: URL, pathname?: string, searchParams?: URLSearchParams) => {
  if (pathname && !pathname.startsWith('/')) {
    throw new Error('Only absolute paths are supported')
  }

  return `${pathname ?? currentUrl.pathname}?${searchParams ?? ''}`.replace(/\?$/, '')
}

const loadPage = async (store: RouterContextActions, newUrl: URL, justFetch = false) => {
  if (import.meta.env.SSR) {
    throw new Error('This API is client-only')
  }

  store.setState({ state: 'navigating' })
  const res = await fetch(newUrl, {
    headers: {
      accept: 'application/json+ssr',
    },
  })
  const data = await res.json() as PartialPageRenderResult
  const modules = await Promise.all(data.a.map(async (asset) => {
    if (asset.type === 'page') {
      const { renderPage } = await import(/* @vite-ignore */ asset.path) as { renderPage: unknown }
      return renderPage
    }
    if (justFetch) {
      return Promise.resolve()
    }
    if (asset.type === 'module') {
      return import(/* @vite-ignore */ asset.path) as Promise<unknown>
    }
    const stylesheet = document.createElement('link')
    stylesheet.rel = 'stylesheet'
    stylesheet.crossOrigin = 'anonymous'
    stylesheet.href = asset.path
    document.head.appendChild(stylesheet)
    return new Promise<void>((resolve) => stylesheet.addEventListener('load', () => resolve(), false))
  }))
  const Page = modules.filter((module) => typeof module === 'function').at(0) as ((props: Record<string, unknown>) => ReactNode) | undefined
  setTimeout(() => {
    if (data.m?.title) {
      document.title = data.m.title
    }
    if (data.m?.description) {
      const descr = document.head.querySelector<HTMLMetaElement>('meta[name=description]')
      if (descr) {
        descr.content = data.m.description
      } else {
        const descr = document.createElement('meta')
        descr.content = data.m.description
        descr.name = 'description'
        document.head.append(descr)
      }
    } else {
      const descr = document.head.querySelector<HTMLMetaElement>('meta[name=description]')
      descr?.remove()
    }

    store.setState({
      ...data.c,
      url: new URL(data.c.url),
      state: 'inactive',
      props: data.p,
      Page,
    })
  }, 0)
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
  const { actions } = useRouterStore()
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
  const url = useRouterContext(useCallback((state) => state.url, []))
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
export const usePathname = (): string => useRouterContext(useCallback((state) => state.pathname, []))

/**
 * Gets the search parameters parsed as {@link URLSearchParams} instance.
 * Any modifications on the object won't be reflected back, please use
 * {@link useNavigate} function instead.
 * @returns The search parameters of the current page.
 */
export const useSearchParams = (): URLSearchParams =>
  useRouterContext(useCallback((state) => state.url.searchParams, []))

/**
 * Gets the route parameters for the given page based on the template
 * defined for this page path.
 * @returns The route parameters.
 */
export const useParams = <T extends Record<string, string>>(): T =>
  useRouterContext(useCallback((state) => state.params as T, []))

/**
 * Gets a function that navigates the page to the new path.
 * @returns A function to navigate in the app.
 */
export const useNavigate = (): (path: string | { pathname?: string, searchParams?: URLSearchParams }, mode?: 'replace' | 'push') => void => {
  const { actions } = useRouterStore()
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
          if (mode === 'push') {
            history.pushState({}, '', newUrl)
          } else if (mode === 'replace') {
            history.replaceState({}, '', newUrl)
          }
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
export const useNavigationStatus = (): RouterContextState['state'] =>
  useRouterContext(useCallback((state) => state.state, []))

/**
 * Gets a function to force reload loader data when requested.
 * @returns A function to call when a data revalidation is needed.
 */
export const useRevalidator = (): () => Promise<void> => {
  const { actions, state: { state, url } } = useRouterStore()
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
      {...props as object}
      onClick={improvedClick}
      href={href}
    >
      {children}
    </a>
  )
}

export function SsrRouterProvider({ initialValue }: Readonly<{
  readonly initialValue: SsrRouterProviderProps
}>) {
  const [state, setState] = useState<RouterContextState>(() => ({
    basePath: initialValue.basePath,
    blockerFns: [],
    Page: initialValue.Page,
    params: initialValue.params,
    pathname: initialValue.pathname,
    props: initialValue.props,
    state: 'inactive',
    url: initialValue.url,
  }))
  const [isTransitioning, startTransition] = useTransition()
  const stateRef = useRef(state)
  stateRef.current = state

  const actions = useMemo((): RouterContextActions => ({
    getState: () => stateRef.current,
    setState: (vfn) => setState((v) => {
      const result = typeof vfn === 'function' ? vfn(v) : vfn
      return { ...v, ...result }
    }),
    appendBlockerFn: (fn) => setState((v) => ({ ...v, blockerFns: [...v.blockerFns, fn] })),
    removeAllBlockerFns: () => setState((v) => ({ ...v, blockerFns: [] })),
    removeBlockerFn: (fn) => setState((v) => {
      const idx = v.blockerFns.indexOf(fn)
      return idx >= 0
        ? {
            ...v,
            blockerFns: v.blockerFns.toSpliced(idx, 1),
          }
        : v
    }),
    changeUrl(newUrl) {
      startTransition(() => setState((v) => ({ ...v, url: newUrl })))
    },
    loadPage(newUrl, justFetch = false) {
      const pagePromise = loadPage(this, newUrl, justFetch)
      startTransition(() => setState((v) => ({ ...v, state: 'navigating', pagePromise })))
      return pagePromise
    },
  }), [])

  useEffect(() => {
    if (import.meta.env.SSR) {
      return () => {}
    }

    const abort = new AbortController()
    window.addEventListener('popstate', () => {
      const newUrl = new URL(location.href)
      trySmoothNavigation(actions, newUrl)
        .catch(() => window.location.reload())
    }, {
      passive: false,
      signal: abort.signal,
    })
    return () => abort.abort()
  }, [actions])

  if (state.pagePromise) {
    use(state.pagePromise)
  }
  const { Page, props } = state
  return <SsrRouterContext value={{ state: { ...state, state: isTransitioning ? 'navigating' : state.state }, actions }}><Page {...props} /></SsrRouterContext>
}
