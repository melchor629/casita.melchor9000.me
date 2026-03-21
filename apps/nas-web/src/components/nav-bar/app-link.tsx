import { MenuItem } from '@melchor629/ui'
import capitalize from 'lodash-es/capitalize'
import { useCallback } from 'react'
import { NavLink, type NavLinkRenderProps } from 'react-router'

type AppLinkProps = Readonly<{
  appKey: string
  name: string
}>

export default function AppLink({ appKey, name }: AppLinkProps) {
  const fn = useCallback(
    ({ isActive }: NavLinkRenderProps) => <MenuItem label={capitalize(name)} selected={isActive} />,
    [name],
  )
  return <NavLink to={`/${appKey}`}>{fn}</NavLink>
}
