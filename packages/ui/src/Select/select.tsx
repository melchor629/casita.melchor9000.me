import { useCallback, useEffect, useMemo, type ChangeEvent, type ComponentProps } from 'react'
import { clsx } from '../utils'

export type SelectProps<T = string> = Readonly<Omit<ComponentProps<'select'>, 'value' | 'onChange' | 'role' | 'size'> & {
  emptyValue?: T
  values: readonly T[]
  keySelector?: (value: T) => string
  labelSelector?: (value: T) => string
  onChange?: (value: T | null) => void
  value: T | null
  fullWidth?: boolean
  size?: 'small' | 'medium' | 'large'
  selectSize?: number
}>

const iden = (value: unknown): string => value as string
const str: (value: unknown) => string = JSON.stringify

function Option({ children, className, ...props }: ComponentProps<'option'>) {
  return (
    <option
      {...props}
      className={clsx('text-text-main bg-text-contrasted', className)}
    >
      {children}
    </option>
  )
}

function Select<T>({
  children,
  className,
  emptyValue,
  fullWidth,
  keySelector = iden,
  labelSelector = iden,
  onChange,
  selectSize,
  size,
  value,
  values,
  ...props
}: SelectProps<T>) {
  const keys = useMemo(() => values.map(keySelector).map(str), [values, keySelector])
  const labels = useMemo(() => values.map(labelSelector), [values, labelSelector])
  const valued = useMemo(() => value != null ? str(keySelector(value)) : '', [keySelector, value])

  const onChangeImpl = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const key = e.currentTarget.value
    onChange?.(values.find((_, i) => keys[i] === key) ?? null)
  }, [values, keys, onChange])

  useEffect(() => {
    if (emptyValue != null) {
      if (!keys.includes(valued) && valued !== str(keySelector(emptyValue))) {
        onChange?.(emptyValue)
      }
    }
  }, [valued, keys, onChange, emptyValue, keySelector])

  return (
    <select
      className={clsx(
        'appareance-none rounded-md',
        fullWidth && 'w-full',
        'text-body text-text-main',
        'bg-text-main/10 hover:bg-text-main/15',
        'border border-text-secondary group-[.error]/form-control:border-error-main',
        'focus-within:outline-3 outline-0 outline-text-secondary/50 group-[.error]/form-control:outline-error-main/50',
        size === 'small' && 'px-1.5 py-1 text-body-small placeholder:text-body-small',
        size === 'medium' && 'px-2 py-1',
        size === 'large' && 'px-3 py-1.5',
        'not-disabled:cursor-pointer disabled:opacity-disabled',
        'transition-all',
        className,
      )}
      onChange={onChangeImpl}
      value={valued}
      size={selectSize}
      {...props}
    >
      {emptyValue != null && (
        <Option value={str(keySelector(emptyValue))} disabled>
          {labelSelector(emptyValue)}
        </Option>
      )}
      {values.map((_, i) => (
        <Option key={keys[i]} value={keys[i]}>{labels[i]}</Option>
      ))}
    </select>
  )
}

export default Select
