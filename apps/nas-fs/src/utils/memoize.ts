export default <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends (arg: any, ...args: any[]) => any,
  FA = Parameters<T>[0],
  RT = ReturnType<T>,
>(func: T) => {
  const cache = new Map<FA, RT>()
  const impl = (...args: Parameters<T>) => {
    const key = args[0] as FA
    const otherArgs = args.slice(1) as Parameters<T> extends [unknown, ...infer P] ? P : never
    if (!cache.has(key)) {
      cache.set(key, func(key, ...otherArgs) as RT)
    }

    return cache.get(key)!
  }
  impl.cache = cache
  return impl
}
