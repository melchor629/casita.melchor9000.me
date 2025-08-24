import type { MouseEventHandler } from 'preact'
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ComponentPropsWithRef,
  type FC,
} from 'preact/compat'

const ssrTypeSymbol = Symbol('ssr:type')

export class SsrError extends Error {
  readonly [ssrTypeSymbol]: 'redirect' | 'not-found'

  constructor(type: SsrError[typeof ssrTypeSymbol], message?: string, options?: ErrorOptions) {
    super(message, options)
    this[ssrTypeSymbol] = type
  }
}

export const isSsrError = (error: unknown): error is SsrError =>
  error instanceof SsrError || (error instanceof Error && ssrTypeSymbol in error)

export const getSsrErrorType = (error: SsrError) =>
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

type RouterHooks = {
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

export const SsrRouterContext = createContext<SsrRouterContextValue>(null!)

export const { useHref, useNavigate, useParams, usePathname, useSearchParams } = ((): RouterHooks => {
  const getHref = (currentUrl: URL, pathname?: string, searchParams?: URLSearchParams) => {
    if (pathname && !pathname.startsWith('/')) {
      throw new Error('Only absolute paths are supported')
    }

    return `${pathname ?? currentUrl.pathname}?${searchParams}`.replace(/\?$/, '')
  }

  if (import.meta.env.SSR) {
    return {
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
    }
  }

  if (!('__cc' in window) || typeof window.__cc !== 'object' || window.__cc == null) {
    throw new Error('Missing SSR context')
  }

  const context = {
    ...window.__cc as SsrRouterContextValue,
    url: new URL((window.__cc as SsrRouterContextValue).url),
  }
  const fns: Array<() => void> = []
  window.addEventListener('popstate', () => {
    context.url = new URL(location.href)
    fns.forEach((fn) => fn())
  }, false)
  return {
    useHref: (path) => {
      return useMemo(
        () =>
          typeof path === 'string'
            ? getHref(context.url, path)
            : getHref(context.url, path.pathname, path.searchParams),
        [path],
      )
    },
    usePathname: () => context.pathname,
    useSearchParams: () =>
      useSyncExternalStore(
        (notify) => {
          fns.push(notify)
          return () => fns.splice(fns.indexOf(notify))
        },
        () => context.url.searchParams,
      ),
    useParams: <T extends Record<string, string>>() => context.params as T,
    useNavigate: () => useMemo(() => (path, mode = 'push') => {
      if (typeof path === 'string') {
        const a = new URL(path, location.origin)
        path = { pathname: a.pathname, searchParams: a.searchParams }
      }

      const newUrl = new URL(
        `${path.pathname ?? context.url.pathname}?${path.searchParams ?? ''}`.replace(/\?$/, ''),
        location.origin,
      )
      if (mode === 'push') {
        history.pushState({}, '', newUrl)
      } else if (mode === 'replace') {
        history.replaceState({}, '', newUrl)
      }
      if (path.pathname != null && path.pathname !== context.pathname) {
        location.assign(newUrl)
      } else {
        context.url = newUrl
        fns.forEach((fn) => fn())
      }
    }, []),
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
