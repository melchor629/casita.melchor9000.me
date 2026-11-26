// see
const emptySymbol = Symbol('EmptyObject type')

/**
 * Represents an empty object like `{}`, but avoiding the issues that has the type `{}` or similar
 * in ts.
 */
export type EmptyObject = { [emptySymbol]?: never }
