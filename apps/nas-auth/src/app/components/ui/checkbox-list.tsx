import { Checkbox, InputLabel } from '@melchor629/ui'
import { useCallback, useMemo, type ChangeEvent } from 'react'

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
        <InputLabel key={key} className="mx-1" input={<Checkbox checked={checked} onChange={inputChanged(i)} />}>
          {label}
        </InputLabel>
      ))}
    </div>
  )
}

export default CheckboxList
