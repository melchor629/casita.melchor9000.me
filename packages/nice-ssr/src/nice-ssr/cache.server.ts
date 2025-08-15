import { getRequestStorage } from '../entry/request-storage'

const CACHE_STORAGE_INTERMEDIATE = 0
const CACHE_STORAGE_OK = 1
const CACHE_STORAGE_ERROR = 2

type CacheStorageIntermediateNode<T> = {
  t: typeof CACHE_STORAGE_INTERMEDIATE
  v: void
  o: WeakMap<object, CacheStorageNode<T>> | null
  p: Map<string | number | symbol | boolean | null | undefined, CacheStorageNode<T>> | null
}

type CacheStorageOkNode<T> = {
  t: typeof CACHE_STORAGE_OK
  v: T
  o: CacheStorageIntermediateNode<T>['o']
  p: CacheStorageIntermediateNode<T>['p']
}

type CacheStorageErrorNode<T> = {
  t: typeof CACHE_STORAGE_ERROR
  v: unknown
  o: CacheStorageIntermediateNode<T>['o']
  p: CacheStorageIntermediateNode<T>['p']
}

type CacheStorageNode<T> =
  | CacheStorageIntermediateNode<T>
  | CacheStorageOkNode<T>
  | CacheStorageErrorNode<T>

const createRootStorage = <T>(): WeakMap<object, CacheStorageNode<T>> => new WeakMap()

const createNode = <T>(): CacheStorageNode<T> => ({
  t: CACHE_STORAGE_INTERMEDIATE,
  v: undefined,
  o: null,
  p: null,
})

const cache = <TArgs extends Array<string | number | symbol | boolean | null | undefined | object>, TReturn>(
  fn: (...args: TArgs) => TReturn,
): (...args: TArgs) => TReturn => {
  return (...args) => {
    const storage = getRequestStorage()?.getCacheForType(createRootStorage)
    if (!storage) {
      // not running inside a request, no cache then
      return fn(...args)
    }

    // get root node for this function
    let fnNode = storage.get(fn) as CacheStorageNode<TReturn>
    if (!fnNode) {
      fnNode = createNode()
      storage.set(fn, fnNode)
    }

    // iterate over arguments to create the linked list cache
    let currentNode = fnNode
    for (const arg of args) {
      if (typeof arg === 'function' || (typeof arg === 'object' && arg != null)) {
        // manage objects and functions with WeakMaps
        const objCache = currentNode.o ??= new WeakMap()
        let objNode = objCache.get(arg)
        if (objNode == null) {
          objNode = createNode()
          objCache.set(arg, objNode)
        }

        currentNode = objNode
      } else {
        // manage primitives with a Map
        const primCache: CacheStorageIntermediateNode<TReturn>['p'] = currentNode.p ??= new Map()
        let primNode = primCache.get(arg)
        if (primNode == null) {
          primNode = createNode<TReturn>()
          primCache.set(arg, primNode)
        }

        currentNode = primNode
      }
    }

    ///
    if (currentNode.t === CACHE_STORAGE_OK) {
      return currentNode.v
    }

    if (currentNode.t === CACHE_STORAGE_ERROR) {
      throw currentNode.v
    }

    try {
      const result = fn(...args)
      const okNode = currentNode as unknown as CacheStorageOkNode<TReturn>
      okNode.t = CACHE_STORAGE_OK
      okNode.v = result
      return result
    } catch (error) {
      const errorNode = currentNode as unknown as CacheStorageErrorNode<TReturn>
      errorNode.t = CACHE_STORAGE_ERROR
      errorNode.v = error
      throw error
    }
  }
}

export default cache
