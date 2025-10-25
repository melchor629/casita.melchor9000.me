import clsx from 'clsx'
import { motion } from 'motion/react'
import { memo } from 'react'

const DialogContainer = ({ children, size }) => (
  <motion.div
    className={clsx(
      'flex justify-center',
      'my-6 sm:my-12',
      !size && 'mx-4 sm:mx-auto',
      !size && 'sm:w-4/5 max-w-6xl',
      size && 'mx-auto px-4',
      size === 'sm' && 'max-w-sm',
      size === 'md' && 'max-w-md',
      size === 'lg' && 'max-w-lg',
      size === 'xl' && 'max-w-xl',
      size === '2xl' && 'max-w-2xl',
      size === '3xl' && 'max-w-3xl',
      size === '4xl' && 'max-w-4xl',
      size === '5xl' && 'max-w-5xl',
      size === '6xl' && 'max-w-6xl',
    )}
    initial={{ transform: 'translateY(1.0rem)' }}
    animate={{ transform: 'translateY(0rem)' }}
    exit={{ transform: 'translateY(-1.0rem)' }}
  >
    <div
      className={clsx(
        'w-full',
        'bg-gray-300 dark:bg-gray-800',
        'rounded-md',
        'px-4 py-3',
        'shadow-2xl',
      )}
      role="dialog"
    >
      {children}
    </div>
  </motion.div>
)

export default memo(DialogContainer)
