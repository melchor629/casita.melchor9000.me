import type { PropsWithChildren } from 'preact/compat'
import AdminLayout from '#components/admin-layout.tsx'

export default function AdminDefaultLayout({ children }: PropsWithChildren) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  )
}
