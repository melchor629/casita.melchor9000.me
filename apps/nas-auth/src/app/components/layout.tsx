import type { PropsWithChildren } from 'preact/compat'
import Footer from './footer'

const Layout = ({ children }: PropsWithChildren) => (
  <>
    <div className="max-w-sm mx-auto p-6 mt-10 mb-4 rounded-md bg-gray-300 dark:bg-gray-700">
      <main>{children}</main>
    </div>
    <Footer />
  </>
)

export default Layout
