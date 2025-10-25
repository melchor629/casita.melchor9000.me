import type { ChangeEvent } from 'preact/compat'
import { useCallback, useMemo } from 'preact/hooks'
import Input from './input'
import Label from './label'

type CheckboxListOption = Readonly<{ label: string, value: string }>
type CheckboxListProps<T extends string | CheckboxListOption> = Readonly<{
  className?: string
  onChange: (options: T[]) => void
  options: readonly T[]
  selected: T[]
}>

function CheckboxList<T extends string | CheckboxListOption = string>({
  className,
  onChange,
  options,
  selected,
}: CheckboxListProps<T>) {
  const data = useMemo(() => options.map((option) => ({
    key: typeof option === 'string' ? option : option.value,
    label: typeof option === 'string' ? option : option.label,
    checked: selected.includes(option),
  })), [options, selected])

  const inputChanged = useCallback((i: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.currentTarget
    const option = options[i]
    if (checked) {
      onChange([...selected, option])
    } else {
      const idx = selected.indexOf(option)
      onChange([
        ...selected.slice(0, idx),
        ...selected.slice(idx + 1),
      ])
    }
  }, [options, selected, onChange])

  return (
    <div className={className}>
      {data.map(({ checked, key, label }, i) => (
        <Label key={key} className="mx-1">
          <Input type="checkbox" checked={checked} onChange={inputChanged(i)} />
          &nbsp;
          {label}
        </Label>
      ))}
    </div>
  )
}

export default CheckboxList
