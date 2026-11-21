import type { PropsWithChildren } from 'react'
import Footer from './footer'

const AdminLayout = ({ children }: PropsWithChildren) => (
  <div className="mx-12 flex flex-col items-center">
    <div className="bg-elevated-2 mt-10 mb-4 w-full max-w-7xl rounded-md p-6">
      <main>{children}</main>
    </div>
    <Footer />
  </div>
)

export default AdminLayout
