import type { Context, MouseEventHandler } from 'preact'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithRef,
  type FC,
} from 'preact/compat'
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

type RouterHooks = {
  /**
   * Allows blocking navigation if the condition in {@link shouldBlock} matches. When it is blocked,
   * the blocker object will have `state === 'blocked'` and one of the `proceed` or `reset` functions
   * must be called to continue or cancel the navigation. When the state is `state === 'proceeding'`,
   * the navigation is taking place right now.
   * @param shouldBlock A boolean or function that returns a boolean which decides if the navigation should be blocked.
   * @returns The blocker interface.
   */
  useBlocker: (shouldBlock: boolean | ((opts: { current: URL, next: URL }) => boolean)) => Blocker
  /**
   * Calculates the `href` of the provided path.
   * @param path The path to get the URL.
   * @returns The resolved href.
   */
  useHref: (path: string | { pathname?: string, searchParams?: URLSearchParams }) => string
  /**
   * Gets a function that navigates the page to the new path.
   * @returns A function to navigate in the app.
   */
  useNavigate: () => (path: string | { pathname?: string, searchParams?: URLSearchParams }, mode?: 'replace' | 'push') => void
  /**
   * Gets the route parameters for the given page based on the template
   * defined for this page path.
   * @returns The route parameters.
   */
  useParams: <T extends Record<string, string>>() => T
  /**
   * Gets the pathname of the current page. The pathname does not include
   * search parameters nor hash.
   * @returns The pathname of the current page.
   */
  usePathname: () => string
  /**
   * Gets a function to force reload loader data when requested.
   * @returns A function to call when a data revalidation is needed.
   */
  useRevalidator: () => () => Promise<void>
  /**
   * Gets the search parameters parsed as {@link URLSearchParams} instance.
   * Any modifications on the object won't be reflected back, please use
   * {@link useNavigate} function instead.
   * @returns The search parameters of the current page.
   */
  useSearchParams: () => URLSearchParams
}

export type SsrRouterContextValue = Readonly<{
  url: URL
  basePath: string
  pathname: string
  params: Record<string, string>
}>

export const SsrRouterContext: Context<SsrRouterContextValue> = createContext<SsrRouterContextValue>(null!)

export const { useBlocker, useHref, useNavigate, useParams, usePathname, useSearchParams } = ((): RouterHooks => {
  const getHref = (currentUrl: URL, pathname?: string, searchParams?: URLSearchParams) => {
    if (pathname && !pathname.startsWith('/')) {
      throw new Error('Only absolute paths are supported')
    }

    return `${pathname ?? currentUrl.pathname}?${searchParams}`.replace(/\?$/, '')
  }

  if (import.meta.env.SSR) {
    return {
      useBlocker: () => ({ state: 'unblocked' }),
      useHref: (path) => {
        const { url } = useContext(SsrRouterContext)
        return useMemo(() => typeof path === 'string' ? getHref(url, path) : getHref(url, path.pathname, path.searchParams), [url, path])
      },
      usePathname: () => useContext(SsrRouterContext).pathname,
      useSearchParams: () => {
        const { searchParams } = useContext(SsrRouterContext).url
        return useMemo(() => new URLSearchParams(searchParams), [searchParams])
      },
      useParams: <T extends Record<string, string>>() => useContext(SsrRouterContext).params as T,
      useNavigate: () => {
        const { pathname, url } = useContext(SsrRouterContext)
        return useMemo(
          () => (path) => {
            if (typeof path === 'string') {
              redirect(path)
            }

            redirect(getHref(url, pathname, path.searchParams))
          },
          [pathname, url],
        )
      },
      useRevalidator: () => () => Promise.resolve(),
    }
  }

  if (!('__cc' in window) || typeof window.__cc !== 'object' || window.__cc == null) {
    throw new Error('Missing SSR context')
  }

  const context = {
    ...window.__cc as SsrRouterContextValue,
    url: new URL((window.__cc as SsrRouterContextValue).url),
  }
  const blockerFns: Array<(newUrl: URL, result: Promise<'proceed' | 'block'>) => Promise<'proceed' | 'block'>> = []
  const loadPage = async (newUrl: URL, justFetch = false) => {
    const res = await fetch(newUrl, {
      headers: {
        accept: 'application/json+ssr',
      },
    })
    const data = await res.json() as PartialPageRenderResult
    const modules = await Promise.all(data.a.map(async (asset) => {
      if (asset.type === 'page') {
        const { default: rerender } = await import(/* @vite-ignore */ asset.path) as { default: () => void }
        return rerender
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
    const rerender = modules.filter((module) => typeof module === 'function').at(0)
    setTimeout(() => {
      Object.assign(context, data.c)
      context.url = new URL(data.c.url)

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

      rerender?.(data.p)
    }, 0)
  }
  const trySmoothNavigation = async (newUrl: URL) => {
    if (newUrl.pathname !== context.pathname) {
      try {
        const { promise: blockerResult, resolve } = Promise.withResolvers<'block' | 'proceed'>()
        const blockersResults = await Promise.all(blockerFns.map((fn) => fn(newUrl, blockerResult)))
        if (blockersResults.includes('block')) {
          resolve('block')
          return 'block'
        }
        resolve('proceed')
        await loadPage(newUrl)
      } catch {
        location.assign(newUrl)
        return 'block'
      }
    } else {
      context.url = new URL(location.href)
      navigatedFns.forEach((fn) => fn())
    }
    return 'proceed'
  }
  const navigatedFns: Array<() => void> = []
  window.addEventListener('popstate', () => {
    const newUrl = new URL(location.href)
    trySmoothNavigation(newUrl)
      .then(() => navigatedFns.forEach((fn) => fn()))
      .catch(() => window.location.reload())
  }, false)
  const useRouterContext = () =>
    useSyncExternalStore(
      (notify) => {
        navigatedFns.push(notify)
        return () => navigatedFns.splice(navigatedFns.indexOf(notify))
      },
      () => context,
    )
  return {
    useBlocker: (shouldBlock) => {
      const [blockerState, setBlockerState] = useState<Blocker>({ state: 'unblocked' })
      useEffect(() => {
        let navFn: (() => void) | null = null
        const fn = (newUrl: URL, result: Promise<'proceed' | 'block'>) => {
          if (shouldBlock === false) {
            return Promise.resolve<'proceed'>('proceed')
          }
          if (typeof shouldBlock === 'function' && !shouldBlock({ current: context.url, next: newUrl })) {
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
                navigatedFns.push(navFn)
              } else {
                setBlockerState({ state: 'unblocked' })
              }
            })
            .catch(() => {})
          return promise
        }
        blockerFns.push(fn)
        return () => {
          blockerFns.splice(blockerFns.indexOf(fn))
          if (navFn) {
            navigatedFns.splice(navigatedFns.indexOf(navFn))
            navFn = null
          }
        }
      }, [shouldBlock])
      return blockerState
    },
    useHref: (path) => {
      const { url } = useRouterContext()
      return useMemo(
        () =>
          typeof path === 'string'
            ? getHref(url, path)
            : getHref(url, path.pathname, path.searchParams),
        [path, url],
      )
    },
    usePathname: () => useRouterContext().pathname,
    useSearchParams: () => useRouterContext().url.searchParams,
    useParams: <T extends Record<string, string>>() => useRouterContext().params as T,
    useNavigate: () => useMemo(() => async (path, mode = 'push') => {
      if (typeof path === 'string') {
        const a = new URL(path, location.origin)
        path = { pathname: a.pathname, searchParams: a.searchParams }
      }

      const newUrl = new URL(
        `${path.pathname ?? context.url.pathname}?${path.searchParams ?? ''}`.replace(/\?$/, ''),
        location.origin,
      )
      if (await trySmoothNavigation(newUrl) === 'proceed') {
        if (mode === 'push') {
          history.pushState({}, '', newUrl)
        } else if (mode === 'replace') {
          history.replaceState({}, '', newUrl)
        }
        navigatedFns.forEach((fn) => fn())
      }
    }, []),
    useRevalidator: () => useCallback(() => loadPage(context.url, true), []),
  }
})()

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
