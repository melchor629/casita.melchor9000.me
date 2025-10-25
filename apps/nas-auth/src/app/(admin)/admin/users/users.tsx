'use client'

import { useMemo, useState } from 'preact/hooks'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import { AddUserDialog } from '#components/admin/user/index.ts'
import {
  Button,
  H2,
  Table,
  TableBody,
  TableHead,
  TableHeadColumn,
  TableRow,
} from '#components/ui/index.ts'
import type { GetUsers } from '#queries/get-users.ts'
import UserRow from './user-row'

const breadcrumbSections = [{ part: 'users', name: 'Users' }]

const Users = ({ users }: { readonly users: GetUsers }) => {
  const [opened, setOpened] = useState(false)
  const { data: { permissions } } = useEnsureGetSession()
  const userPermission = useMemo(() => permissions.find((p) => p.key === 'user'), [permissions])

  return (
    <>
      <div className="flex justify-between mb-2">
        <H2>Users</H2>
        {userPermission?.write && <Button type="button" size="sm" onClick={() => setOpened(true)}>Add</Button>}
      </div>

      <Table className="mt-2 mb-2">
        <TableHead>
          <TableRow>
            <TableHeadColumn>ID</TableHeadColumn>
            <TableHeadColumn>Pic</TableHeadColumn>
            <TableHeadColumn>User Name</TableHeadColumn>
            <TableHeadColumn>Display Name</TableHeadColumn>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
            />
          ))}
        </TableBody>
      </Table>

      {userPermission?.write && <AddUserDialog opened={opened} setOpened={setOpened} />}

      <AdminBreadcrumb sections={breadcrumbSections} />
    </>
  )
}

export default Users
