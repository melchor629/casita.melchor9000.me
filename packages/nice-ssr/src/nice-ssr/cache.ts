/**
 * Wraps the function into the request cache. Multiple calls to this function with
 * the same parameters will return the same result from the cache, inside a request.
 * Calling the function outside a request will not use cache.
 * @param fn Function to cache.
 * @returns The function cached.
 */
const cache: <TArgs extends Array<string | number | symbol | boolean | null | undefined | object>, TReturn>(
  fn: (...args: TArgs) => TReturn,
) => (...args: TArgs) => TReturn = await (async () => {
  if (import.meta.env.SSR) {
    return (await import('./cache.server')).default
  } else {
    return (await import('./cache.client')).default
  }
})()

export default cache
