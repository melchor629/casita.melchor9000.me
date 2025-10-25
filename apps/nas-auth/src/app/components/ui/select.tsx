'use client'

import { clsx } from 'clsx'
import type { ChangeEvent } from 'preact/compat'
import { useCallback, useEffect, useMemo } from 'preact/hooks'
import type { BaseHtmlProps } from './types'

type SelectProps<T = string> = Omit<BaseHtmlProps<'select', {
  emptyValue?: T
  values: readonly T[]
  keySelector?: (value: T) => string
  labelSelector?: (value: T) => string
}>, 'onChange' | 'value' | 'role'> & {
  readonly onChange?: (value: T | null) => void
  readonly value: T | null
}

const iden = (value: unknown): string => value as string
const str: (value: unknown) => string = JSON.stringify

function Option({ children, className, ...props }: BaseHtmlProps<'option'>) {
  return (
    <option
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx('select-option', className)}
    >
      {children}
    </option>
  )
}

function Select<T>({
  children,
  className,
  emptyValue,
  keySelector,
  labelSelector,
  onChange,
  value,
  values,
  ...props
}: SelectProps<T>) {
  const keys = useMemo(() => values.map(keySelector ?? iden).map(str), [values, keySelector])
  const labels = useMemo(() => values.map(labelSelector ?? iden), [values, labelSelector])
  const valued = useMemo(() => value != null ? str((keySelector ?? iden)(value)) : '', [keySelector, value])

  const onChangeImpl = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const key = e.currentTarget.value
    onChange?.(values.find((_, i) => keys[i] === key) ?? null)
  }, [values, keys, onChange])

  useEffect(() => {
    if (emptyValue != null) {
      if (!keys.includes(valued) && valued !== str((keySelector ?? iden)(emptyValue))) {
        onChange?.(emptyValue)
      }
    }
  }, [valued, keys, onChange, emptyValue, keySelector])

  return (
    <select
      className={clsx(
        'text-md',
        'text-slate-900 dark:text-slate-100',
        'bg-black/20 dark:bg-white/20',
        'hover:bg-black/35 dark:hover:bg-white/25',
        'rounded-md',
        'outline-0',
        'p-1',
        'hover:cursor-pointer',
        'transition',
        className,
      )}
      onChange={onChangeImpl}
      value={valued}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {emptyValue != null && (
        <Option value={str((keySelector ?? iden)(emptyValue))} disabled>
          {(labelSelector ?? iden)(emptyValue)}
        </Option>
      )}
      {values.map((_, i) => (
        <Option key={keys[i]} value={keys[i]}>{labels[i]}</Option>
      ))}
    </select>
  )
}

export default Select
