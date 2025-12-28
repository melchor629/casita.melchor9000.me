import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import Button from './core/button'
import { ExpandLess, ExpandMore } from './icons'

type CollapsableTextProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const CollapsableText = ({ children, ...props }: CollapsableTextProps) => {
  const [div, setDiv] = useState<HTMLDivElement | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const ignoreExpand = useMemo(() => {
    if (!div) {
      return true
    }

    const lineHeight = parseFloat(getComputedStyle(div).lineHeight)
    return div.scrollHeight <= lineHeight * 3
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, div])

  const toggleOpen = useCallback(() => setIsOpen((v) => !v), [])

  useLayoutEffect(() => {
    if (!div) {
      return
    }

    if (isOpen) {
      div.style.maxHeight = `${div.clientHeight + div.scrollHeight}px`
    } else {
      const lineHeight = parseFloat(getComputedStyle(div).lineHeight)
      div.style.maxHeight = `${lineHeight * 3}px`
    }
  }, [div, children, isOpen])

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div {...props}>
      <div ref={setDiv} className="overflow-hidden transition-all duration-250">
        {children}
      </div>
      {!ignoreExpand && (
        <Button
          type="button"
          variant="text"
          color="neutral"
          className="mt-2"
          onClick={toggleOpen}
          icon={isOpen
            ? <ExpandLess />
            : <ExpandMore />}
        >
          {isOpen ? 'Read less' : 'Read more'}
        </Button>
      )}
    </div>
  )
}

export default CollapsableText
