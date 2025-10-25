import { useState } from 'preact/hooks'
import type { GetPermissions } from '../../../../queries/get-permissions'
import type { GetUserQuery } from '../../../../queries/get-user'
import {
  Button,
  H3,
  Table,
  TableBody,
  TableHead,
  TableHeadColumn,
  TableRow,
} from '../../ui'
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
      <div className="flex justify-between mb-2">
        <H3>Permissions</H3>
        {!readOnly && <Button type="button" size="sm" onClick={() => setOpened(true)}>Add</Button>}
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadColumn>App</TableHeadColumn>
            <TableHeadColumn>Key</TableHeadColumn>
            <TableHeadColumn>Can Write?</TableHeadColumn>
            <TableHeadColumn>Can Delete?</TableHeadColumn>
            <TableHeadColumn shrink>Actions</TableHeadColumn>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions!.map((permission) => (
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
