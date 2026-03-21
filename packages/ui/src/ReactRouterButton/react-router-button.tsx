import { Link } from 'react-router'
import Button, { type ButtonProps } from '../Button'
import { useButtonGroup } from '../Button/button-group-context'

export type ReactRouterButtonProps = ButtonProps<typeof Link>
const ReactRouterButton = ({ variant, ...props }: ReactRouterButtonProps) => {
  const { variant: groupVariant } = useButtonGroup()
  return <Button component={Link} variant={variant ?? groupVariant ?? 'text'} {...props} />
}

export default ReactRouterButton
