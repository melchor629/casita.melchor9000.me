import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

export type PortalProps = Readonly<{
  children: ReactNode
  /**
   * If `true` or an `HTMLElement`, then the {@link children}
   * will be placed inside the provided element (or body if `true`).
   */
  portal?: boolean | HTMLElement
}>

/**
 * Creates a portal if the property `portal` is filled. Otherwise
 * just retuns the children as is. If `portal` is `true`, the
 * portal will be placed in the `document.body`. If it is any
 * element, then will be placed inside that element.
 *
 * A portal is a React element that renders its children in a
 * different HTML element instead of being children of the
 * parent HTML element as usual. It's a wrapper of {@link createPortal}.
 * @param param0 Props
 * @returns Element or portal
 */
export default function Portal({ children, portal }: PortalProps) {
  if (portal) {
    return createPortal(children, typeof portal === 'boolean' ? document.body : portal)
  }

  return children
}
