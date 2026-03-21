import Text from '../Text'
import { clsx } from '../utils'
import type { MenuItemOptions } from './menu'

export default function MenuItem({
  disabled,
  icon,
  label,
  onAction,
  selected,
}: Omit<MenuItemOptions, 'key'>) {
  return (
    <button
      type="button"
      className={clsx(
        'w-full inline-flex items-center gap-2 px-2 py-1 select-none text-nowrap',
        'rounded-sm',
        'transition-colors',
        'hover:not-disabled:bg-text-main/10',
        'aria-current:bg-text-main/15',
        'not-disabled:cursor-pointer',
        'disabled:opacity-disabled',
      )}
      disabled={disabled}
      aria-current={selected}
      onClick={onAction}
    >
      {icon && (
        <div className="inline-flex text-body-large">{icon}</div>
      )}
      <Text size="body" color="textMain" ellipsize>{label}</Text>
    </button>
  )
}
