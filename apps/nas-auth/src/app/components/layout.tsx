import type { PropsWithChildren } from 'react'
import Footer from './footer'

const Layout = ({ children }: PropsWithChildren) => (
  <>
    <div className="max-w-sm mx-auto p-6 mt-10 mb-4 rounded-md bg-elevated-2">
      <main>{children}</main>
    </div>
    <Footer />
  </>
)

export default Layout
