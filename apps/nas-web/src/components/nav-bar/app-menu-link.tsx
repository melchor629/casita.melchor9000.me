import capitalize from 'lodash-es/capitalize'
import { memo } from 'react'
import { NavLink } from 'react-router'

const AppMenuLink = memo(({ appKey, children, name }: React.PropsWithChildren<{
  readonly appKey: string
  readonly name: string
}>) => (
  <NavLink to={`/${appKey}/`} className="px-3 py-1.5 transition-colors hover:bg-text-main/10 aria-[current=page]:text-primary-main">
    {children || capitalize(name)}
  </NavLink>
))

export default AppMenuLink
