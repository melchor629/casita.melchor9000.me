import { Link } from 'react-router'
import Button, { type ButtonProps } from './button'

export type ReactRouterButtonProps = ButtonProps<typeof Link>
const ReactRouterButton = ({ variant = 'text', ...props }: ReactRouterButtonProps) =>
  <Button component={Link} variant={variant} {...props} />

export default ReactRouterButton
