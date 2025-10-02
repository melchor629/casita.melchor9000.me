import { clsx } from 'clsx'
import { useMemo } from 'preact/hooks'
import { toRomaji } from '../jp-utils'

const JapaneseWithRomaji = ({ value }: { readonly value: string }) => (
  <div
    class={clsx(
      'relative',
      'grow',
      'flex flex-col',
      'cursor-help',
      '*:transition',
      'hover:*:first-of-type:opacity-0',
      'hover:*:last-of-type:opacity-100',
    )}
  >
    <span>{value}</span>
    <span class="absolute top-0 left-0 w-full opacity-0">
      {useMemo(() => toRomaji(value), [value])}
    </span>
  </div>
)

export default JapaneseWithRomaji
