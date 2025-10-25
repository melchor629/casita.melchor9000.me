import { useState } from 'preact/hooks'
import type { GetApplication } from '../../../../queries/get-application'
import {
  Button,
  H3,
  Table,
  TableBody,
  TableHead,
  TableHeadColumn,
  TableRow,
} from '../../ui'
import AddApplicationPermissionDialog from './add-application-permission-dialog'
import EditApplicationPermissionRow from './edit-application-permission-row'

type EditApplicationPermissionsProps = Readonly<{
  application: GetApplication
  canDelete: boolean
  readOnly: boolean
}>

const EditApplicationPermissions = ({
  application: { key: applicationId, permissions },
  canDelete,
  readOnly,
}: EditApplicationPermissionsProps) => {
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
            <TableHeadColumn>ID</TableHeadColumn>
            <TableHeadColumn>Name</TableHeadColumn>
            <TableHeadColumn>Display Name</TableHeadColumn>
            <TableHeadColumn shrink>Actions</TableHeadColumn>
          </TableRow>
        </TableHead>
        <TableBody>
          {permissions.map((permission) => (
            <EditApplicationPermissionRow
              key={permission.id}
              applicationId={applicationId}
              canDelete={canDelete}
              permission={permission}
              readOnly={readOnly}
            />
          ))}
        </TableBody>
      </Table>

      {!readOnly && (
        <AddApplicationPermissionDialog
          applicationId={applicationId}
          opened={opened}
          setOpened={setOpened}
        />
      )}
    </div>
  )
}

export default EditApplicationPermissions
