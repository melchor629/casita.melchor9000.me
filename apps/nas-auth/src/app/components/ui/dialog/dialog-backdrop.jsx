import clsx from 'clsx'
import { motion } from 'motion/react'
import { memo, useMemo } from 'react'

const DialogBackdrop = ({ children, onClosed, onOpened }) => (
  <motion.div
    className={clsx(
      'fixed',
      'top-0 left-0',
      'w-screen h-screen',
      'overflow-y-auto',
      'bg-gray-100/20 dark:bg-gray-900/20',
      'backdrop-blur-xs backdrop-brightness-75 dark:backdrop-brightness-125',
    )}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onAnimationComplete={useMemo(() => (latest) => {
      if (latest.opacity >= 0.999) {
        onOpened?.()
      } else {
        onClosed?.()
      }
    }, [onClosed, onOpened])}
  >
    {children}
  </motion.div>
)

export default memo(DialogBackdrop)
