import { useCallback, useMemo, useState } from 'react'
import Button from '../Button'
import Collapse from '../Collapse'
import Fade from '../Fade'
import { ExpandMore } from '../icons'
import type { TextProps } from '../Text'
import Text from '../Text'
import TransitionGroup from '../TransitionGroup'
import { clsx } from '../utils'

export type CollapsableTextProps = Readonly<
  TextProps<'p'> & {
    /**
     * Maximum number of lines to render when collapsed.
     *
     * @default 3
     */
    maxLines?: number
  }
>

const CollapsableText = ({ children, className, maxLines = 3, ...props }: CollapsableTextProps) => {
  const [div, setDiv] = useState<HTMLElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  maxLines = Math.max(1, maxLines)
  const totalLines = useMemo(() => {
    if (!div) {
      return 9999
    }

    const lineHeight = parseFloat(getComputedStyle(div).lineHeight)
    return Math.trunc(div.scrollHeight / lineHeight)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, div, maxLines])

  const toggleOpen = useCallback(() => setIsOpen((v) => !v), [])

  return (
    <div className={clsx('flex flex-col gap-2 items-end', className)}>
      <Collapse
        component={Text}
        show={isOpen}
        minSize={`${Math.min(maxLines, totalLines)}lh`}
        ref={setDiv}
        className={clsx('w-full', className)}
        {...props}
        ellipsize={false}
      >
        {children}
      </Collapse>
      {maxLines < totalLines && (
        <Button
          type="button"
          variant="text"
          color="neutral"
          size="small"
          onClick={toggleOpen}
          icon={<ExpandMore className={clsx('transition-transform', isOpen && 'rotate-180')} />}
        >
          <TransitionGroup className="text-start">
            <Fade show={isOpen}>Read less</Fade>
            <Fade show={!isOpen}>Read more</Fade>
          </TransitionGroup>
        </Button>
      )}
    </div>
  )
}

export default CollapsableText
