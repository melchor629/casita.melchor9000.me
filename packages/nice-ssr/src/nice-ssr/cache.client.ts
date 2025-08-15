const cache = <TArgs extends Array<string | number | symbol | boolean | null | undefined | object>, TReturn>(
  fn: (...args: TArgs) => TReturn,
): (...args: TArgs) => TReturn => fn

export default cache
