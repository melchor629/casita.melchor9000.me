import { Link } from '@melchor629/nice-ssr'
import packageJson from '../../../package.json' with { type: 'json' }

const { version } = packageJson

const Footer = () => (
  <div className="max-w-sm mx-auto text-gray-500 text-center select-none mb-4">
    nas-auth v
    {`${version} · `}
    <Link to="/privacy">Privacy</Link>
    {' · '}
    <Link to="/">Home</Link>
  </div>
)

export default Footer
