import type { ComponentPropsWithRef, MouseEvent, ReactElement, ReactNode } from 'react'
import { clsx } from '../utils'
import MenuItem from './menu-item'

export type MenuItemOptions = Readonly<{
  key: string
  icon?: ReactElement
  label: ReactNode
  selected?: boolean
  disabled?: boolean
  onAction?: (event: MouseEvent<HTMLButtonElement>) => void
}>

export type MenuProps = Readonly<Omit<ComponentPropsWithRef<'div'>, 'children'> & ({
  /**
   * The list of menu items to render inside the menu.
   */
  items: ReadonlyArray<MenuItemOptions>
  children?: undefined
} | {
  /**
   * The list of menu items elements to render.
   */
  children?: ReactElement | ReadonlyArray<ReactElement>
  items?: undefined
})>

const Menu = ({ children, className, items, ...props }: MenuProps) => {
  return (
    <div
      {...props}
      className={clsx(
        'relative min-w-40 max-w-80 p-1',
        'bg-elevated-1/85 backdrop-blur-sm rounded-md shadow-xl border border-text-main/25',
        'flex flex-col gap-0.5',
        className,
      )}
      role="list"
    >
      {items?.map((item) => (
        <MenuItem
          {...item}
          key={item.key}
        />
      ))}
      {children}
    </div>
  )
}

export default Menu
