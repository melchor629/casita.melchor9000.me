import { Link as RRLink } from 'react-router'
import Link, { type LinkProps } from './link'

export type ReactRouterLinkProps = LinkProps<typeof RRLink>
const ReactRouterLink = (props: ReactRouterLinkProps) => <Link component={RRLink} {...props} />

export default ReactRouterLink
