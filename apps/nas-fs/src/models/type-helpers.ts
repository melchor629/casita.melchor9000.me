import { type Static, Type, type TSchema, type TStringOptions, type TNumberOptions, type TSchemaOptions } from 'typebox'

export { Type, type Static } from 'typebox'

export const Nullable = <T extends TSchema>(schema: T) =>
  Type.Unsafe<Static<T> | null>({
    ...schema,
    // mark it is nullable, it will be removed after
    nullable: true,
  })

export const StringEnum = <const T extends string[]>(values: [...T], options?: TStringOptions) =>
  Type.Unsafe<T[number]>({
    type: 'string',
    enum: values,
    ...options,
  })

export const NumberEnum = <const T extends number[]>(values: [...T], options?: TNumberOptions) =>
  Type.Unsafe<T[number]>({
    type: 'number',
    enum: values,
    ...options,
  })

export const DateTime = (options?: TStringOptions) =>
  Type.Unsafe<Date>({
    type: 'string',
    format: 'date-time',
    ...options,
  })

export const ContentResponse = (
  mimeTypes: Record<`${string}/${string}`, TSchema>,
  options?: TSchemaOptions,
) =>
  Type.Unsafe({
    ...options,
    content: Object.fromEntries(
      Object.entries(mimeTypes)
        .map(([type, schema]) => [type, { schema }]),
    ),
  })

export const Binary = (options?: Omit<TSchemaOptions, 'type' | 'format'>) =>
  Type.Unsafe<ArrayBufferLike | string>({
    ...options,
    type: 'string',
    format: 'binary',
  })
