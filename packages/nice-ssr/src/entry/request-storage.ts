import { AsyncLocalStorage } from 'node:async_hooks'

type RequestStorage = Readonly<{
  getCacheForType: <T>(fn: () => WeakMap<WeakKey, T>) => WeakMap<WeakKey, T>
}>

const asyncLocalStorage = new AsyncLocalStorage<RequestStorage>()

export const runWithStorage = <T = void>(fn: () => Promise<T>): Promise<T> => {
  const cacheStorage = new WeakMap<() => WeakMap<WeakKey, unknown>, WeakMap<WeakKey, unknown>>()
  return asyncLocalStorage.run({
    getCacheForType<T>(fn: () => WeakMap<WeakKey, T>): WeakMap<WeakKey, T> {
      let cache = cacheStorage.get(fn)
      if (!cache) {
        cache = new WeakMap()
        cacheStorage.set(fn, cache)
      }
      return cache as WeakMap<WeakKey, T>
    },
  }, fn)
}

export const getRequestStorage = (): RequestStorage | undefined =>
  asyncLocalStorage.getStore()
