import { Button, Table, TableBody, TableHead, TableHeadCell, TableRow, Text } from '@melchor629/ui'
import { Add } from '@melchor629/ui/icons'
import { useMemo, useState } from 'react'
import { useEnsureGetSession } from '#actions/queries/get-session.ts'
import AdminBreadcrumb from '#components/admin/admin-breadcrumb.tsx'
import { AddUserDialog } from '#components/admin/user/index.ts'
import type { GetUsers } from '#queries/get-users.ts'
import UserRow from './user-row'

const breadcrumbSections = [{ part: 'users', name: 'Users' }]

const Users = ({ users }: { readonly users: GetUsers }) => {
  const [opened, setOpened] = useState(false)
  const { data: { permissions } } = useEnsureGetSession()
  const userPermission = useMemo(() => permissions.find((p) => p.key === 'user'), [permissions])

  return (
    <>
      <div className="flex justify-between items-baseline mb-2">
        <Text size="h2">Users</Text>
        {userPermission?.write && <Button type="button" size="small" onClick={() => setOpened(true)} icon={<Add />} />}
      </div>

      <Table className="mt-2 mb-6" hover full>
        <TableHead>
          <TableRow>
            <TableHeadCell shrink>ID</TableHeadCell>
            <TableHeadCell>Pic</TableHeadCell>
            <TableHeadCell>User Name</TableHeadCell>
            <TableHeadCell>Display Name</TableHeadCell>
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
