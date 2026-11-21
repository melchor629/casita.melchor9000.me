import type { ComponentProps } from 'react'

const AdminLink = ({ children, className, ref, ...props }: ComponentProps<'div'>) => (
  <div
    className="rounded-md bg-black/20 px-3 py-2 shadow-lg transition duration-150 hover:bg-black/15 hover:shadow-md active:shadow-xs dark:bg-white/20 dark:hover:bg-white/15"
    ref={ref}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {children}
  </div>
)

export default AdminLink
