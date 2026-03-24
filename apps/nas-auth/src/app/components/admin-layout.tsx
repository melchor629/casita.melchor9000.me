import type { PropsWithChildren } from 'react'
import Footer from './footer'

const AdminLayout = ({ children }: PropsWithChildren) => (
  <div className="mx-12 flex items-center flex-col">
    <div className="w-full max-w-7xl p-6 mt-10 mb-4 rounded-md bg-elevated-2">
      <main>{children}</main>
    </div>
    <Footer />
  </div>
)

export default AdminLayout
