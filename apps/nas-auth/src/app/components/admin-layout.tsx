import type { PropsWithChildren } from 'preact/compat'
import Footer from './footer'

const AdminLayout = ({ children }: PropsWithChildren) => (
  <div className="mx-12 flex items-center flex-col">
    <div className="w-full max-w-7xl p-6 mt-10 mb-4 rounded-md bg-gray-300 dark:bg-gray-700">
      <main>{children}</main>
    </div>
    <Footer />
  </div>
)

export default AdminLayout
