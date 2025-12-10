import capitalize from 'lodash-es/capitalize'
import { memo } from 'react'
import { NavLink } from 'react-router'

const AppMenuLink = memo(({ appKey, children, name }: React.PropsWithChildren<{
  readonly appKey: string
  readonly name: string
}>) => (
  <NavLink to={`/${appKey}/`} className="list-group-item list-group-item-action">
    {children || capitalize(name)}
  </NavLink>
))

export default AppMenuLink
