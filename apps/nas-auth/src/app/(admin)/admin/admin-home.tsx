'use client'

import { Link } from '@melchor629/nice-ssr'
import { Text } from '@melchor629/ui'
import { useMemo } from 'react'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import AdminLink from '#components/admin/admin-link.tsx'

const AdminHome = () => {
  const { data: { permissions } } = useEnsureGetSession()

  const hasApplications = useMemo(() => permissions.find((p) => p.key === 'application'), [permissions])
  const hasUsers = useMemo(() => permissions.find((p) => p.key === 'user'), [permissions])
  const hasClients = useMemo(() => permissions.find((p) => p.key === 'client'), [permissions])

  return (
    <>
      <Text size="h2">Administration</Text>

      <div className="my-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-3">
        {hasApplications && <Link to="/admin/applications"><AdminLink>Applications</AdminLink></Link>}
        {hasUsers && <Link to="/admin/users"><AdminLink>Users</AdminLink></Link>}
        {hasClients && <Link to="/admin/clients"><AdminLink>Clients</AdminLink></Link>}
      </div>

      <AdminBreadcrumb />
    </>
  )
}

export default AdminHome
