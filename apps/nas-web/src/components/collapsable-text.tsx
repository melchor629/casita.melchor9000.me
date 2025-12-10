import {
  type DetailedHTMLProps,
  type HTMLAttributes,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { styled } from 'styled-components'
import { ExpandLess, ExpandMore } from './icons'

type CollapsableTextProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const CollapsableContainer = styled('div')`
  transition: max-height 250ms ease-in-out;
`

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
      <CollapsableContainer ref={setDiv} className="overflow-hidden">
        {children}
      </CollapsableContainer>
      {!ignoreExpand && (
        <button
          type="button"
          className="btn btn-link text-decoration-none"
          onClick={toggleOpen}
        >
          {isOpen ? 'Read less' : 'Read more'}
          &nbsp;
          {isOpen
            ? <ExpandLess height="1rem" />
            : <ExpandMore height="1rem" />}
        </button>
      )}
    </div>
  )
}

export default CollapsableText
