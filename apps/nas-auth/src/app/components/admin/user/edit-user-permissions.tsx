import { Button, Table, TableBody, TableContainer, TableHead, TableHeadCell, TableRow, Text } from '@melchor629/ui'
import { Add } from '@melchor629/ui/icons'
import { useState } from 'react'
import type { GetPermissions } from '../../../../queries/get-permissions'
import type { GetUserQuery } from '../../../../queries/get-user'
import AddUserPermissionDialog from './add-user-permission-dialog'
import EditUserPermissionRow from './edit-user-permission-row'

type EditUserPermissionsProps = Readonly<{
  canDelete: boolean
  permissions: GetPermissions
  readOnly: boolean
  user: GetUserQuery
}>

const EditUserPermissions = ({
  canDelete,
  permissions: allPermissions,
  readOnly,
  user: { id, permissions },
}: EditUserPermissionsProps) => {
  const [opened, setOpened] = useState(false)

  return (
    <div className="mt-8 mb-2">
      <div className="flex justify-between items-baseline mb-2">
        <Text size="h3">Permissions</Text>
        {!readOnly && <Button type="button" size="small" onClick={() => setOpened(true)} icon={<Add />} />}
      </div>
      <TableContainer>
        <Table hover full>
          <TableHead>
            <TableRow>
              <TableHeadCell>App</TableHeadCell>
              <TableHeadCell>Key</TableHeadCell>
              <TableHeadCell>Can Write?</TableHeadCell>
              <TableHeadCell>Can Delete?</TableHeadCell>
              <TableHeadCell shrink>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <EditUserPermissionRow
                key={permission.id}
                allPermissions={allPermissions}
                canDelete={canDelete}
                permission={permission}
                readOnly={readOnly}
                userId={id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!readOnly && (
        <AddUserPermissionDialog
          allPermissions={allPermissions}
          opened={opened}
          setOpened={setOpened}
          userId={id}
        />
      )}
    </div>
  )
}

export default EditUserPermissions
