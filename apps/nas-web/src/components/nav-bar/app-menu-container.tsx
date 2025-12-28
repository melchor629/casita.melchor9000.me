import { clsx } from '../core/utils'

type AppMenuContainerProps = Readonly<{
  show: boolean
} & React.ComponentProps<'div'>>

const AppMenuContainer = ({ children, className, show, ...props }: AppMenuContainerProps) => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...props}
    data-show={show}
    className={clsx(
      'fixed top-13.5 left-6 z-20 invisible',
      'min-w-40 max-h-60 overflow-y-auto',
      'bg-elevated-1/60 backdrop-blur-sm rounded-sm shadow-xl border border-text-main/25',
      'flex flex-col',
      'translate-y-4 opacity-0 transition-all',
      'data-[show=true]:visible data-[show=true]:translate-y-0 data-[show=true]:opacity-100',
      className,
    )}
  >
    {children}
  </div>
)

export default AppMenuContainer
