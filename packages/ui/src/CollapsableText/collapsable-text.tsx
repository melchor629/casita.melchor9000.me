import {
  useCallback,
  useMemo,
  useState,
} from 'react'
import Button from '../Button'
import type { TextProps } from '../Text'
import Text from '../Text'
import { ExpandMore } from '../icons'
import { clsx } from '../utils'

export type CollapsableTextProps = Readonly<TextProps<'p'> & {
  /**
   * Maximum number of lines to render when collapsed.
   * @default 3
   */
  maxLines?: number
}>

const CollapsableText = ({ children, className, maxLines = 3, ...props }: CollapsableTextProps) => {
  const [div, setDiv] = useState<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const totalLines = useMemo(() => {
    if (!div) {
      return 0
    }

    const lineHeight = parseFloat(getComputedStyle(div).lineHeight)
    return Math.trunc(div.scrollHeight / lineHeight)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, div, maxLines])

  const toggleOpen = useCallback(() => setIsOpen((v) => !v), [])

  return (
    <div className={clsx('flex flex-col gap-2 items-end', className)}>
      <Text
        {...props}
        component="p"
        ref={setDiv}
        data-lines={isOpen ? totalLines : maxLines}
        className={clsx(
          'overflow-hidden w-full',
          'max-h-[calc(attr(data-lines_type(<integer>))*1lh)]',
          'transition-all duration-250',
        )}
      >
        {children}
      </Text>
      {(maxLines < totalLines) && (
        <Button
          type="button"
          variant="text"
          color="neutral"
          size="small"
          onClick={toggleOpen}
          icon={<ExpandMore className={clsx('transition-transform', isOpen && 'rotate-180')} />}
        >
          {isOpen ? 'Read less' : 'Read more'}
        </Button>
      )}
    </div>
  )
}

export default CollapsableText
