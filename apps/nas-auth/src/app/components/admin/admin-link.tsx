import type { ComponentProps } from 'preact'

const AdminLink = ({ children, className, ref, ...props }: ComponentProps<'div'>) => (
  <div
    className="px-3 py-2 bg-black/20 dark:bg-white/20 rounded-md shadow-lg hover:shadow-md active:shadow-xs transition duration-150"
    ref={ref}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
  >
    {children}
  </div>
)

export default AdminLink
