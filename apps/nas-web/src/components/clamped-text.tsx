import { memo, useEffect, useRef } from 'react'

// Code adapted from https://codepen.io/Merri/pen/Dsuim

const ctn = document.createTextNode.bind(document)

// measurement element is made a child of the clamped element to get it's style
const measure = document.createElement('span')

// prevent page reflow
measure.style.position = 'absolute'
// cross-browser width results
measure.style.whiteSpace = 'pre'
// prevent drawing
measure.style.visibility = 'hidden'

const clamp = (el: HTMLElement, lineClamp: number) => {
  // make sure the element belongs to the document
  if (!el.ownerDocument || el.ownerDocument !== document) {
    return
  }
  // reset to safe starting values
  let lineStart = 0
  let wordStart = 0
  let lineCount = 1
  let wasNewLine = false
  const lineWidth = el.clientWidth
  let line: HTMLSpanElement
  // get all the text, remove any line changes
  const text = (el.textContent || el.innerText).replace(/\n/g, ' ')
  // remove all content
  while (el.firstChild !== null) {
    el.removeChild(el.firstChild)
  }
  // add measurement element within so it inherits styles
  el.appendChild(measure)
  // http://ejohn.org/blog/search-and-dont-replace/
  text.replace(/[ ._-]/g, (_, p) => {
    // ignore any further processing if we have total lines
    if (lineCount === lineClamp) {
      return undefined as unknown as string
    }

    const pos = p as number
    // create a text node and place it in the measurement element
    measure.appendChild(ctn(text.substr(lineStart, pos - lineStart)))
    // have we exceeded allowed line width?
    if (lineWidth < measure.clientWidth) {
      let lineText: string
      if (wasNewLine) {
        // we have a long word so it gets a line of it's own
        lineText = text.substr(lineStart, pos + 1 - lineStart)
        // next line start position
        lineStart = pos + 1
      } else {
        // grab the text until this word
        lineText = text.substr(lineStart, wordStart - lineStart)
        // next line start position
        lineStart = wordStart
      }
      // create a line element
      line = document.createElement('span')
      // add text to the line element
      line.appendChild(ctn(`${lineText} `))
      // add the line element to the container
      el.appendChild(line)
      // yes, we created a new line
      wasNewLine = true
      lineCount += 1
    } else {
      // did not create a new line
      wasNewLine = false
    }
    // remember last word start position
    wordStart = pos + 1
    // clear measurement element
    measure.removeChild(measure.firstChild!)

    // TS shitty things
    return undefined as unknown as string
  })
  // remove the measurement element from the container
  el.removeChild(measure)
  // create the last line element
  line = document.createElement('span')
  // give styles required for text-overflow to kick in
  line.style.display = 'block'
  line.style.overflow = 'hidden'
  line.style.textOverflow = 'ellipsis'
  line.style.whiteSpace = 'nowrap'
  line.style.width = '100%'
  // add all remaining text to the line element
  line.appendChild(ctn(text.slice(lineStart)))
  // add the line element to the container
  el.appendChild(line)
}

const ClampedText = memo(({ children, lines }: { readonly children: string, readonly lines: number }) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (ref.current) {
      clamp(ref.current, lines)
    }
  }, [children, lines])

  return <abbr title={children} ref={ref}>{children}</abbr>
})

export default ClampedText
