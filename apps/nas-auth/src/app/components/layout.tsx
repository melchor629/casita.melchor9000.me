import type { PropsWithChildren } from 'react'
import Footer from './footer'

const Layout = ({ children }: PropsWithChildren) => (
  <>
    <div className="bg-elevated-2 mx-auto mt-10 mb-4 max-w-sm rounded-md p-6">
      <main>{children}</main>
    </div>
    <Footer />
  </>
)

export default Layout
