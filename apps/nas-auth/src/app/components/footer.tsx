import { Link } from '@melchor629/nice-ssr'
import packageJson from '../../../package.json' with { type: 'json' }

const { version } = packageJson

const Footer = () => (
  <div className="text-text-secondary mx-auto mb-4 max-w-sm text-center select-none">
    nas-auth v{`${version} · `}
    <Link
      to="/privacy"
      viewTransition
    >
      Privacy
    </Link>
    {' · '}
    <Link
      to="/"
      viewTransition
    >
      Home
    </Link>
  </div>
)

export default Footer
