import { Button, Table, TableBody, TableContainer, TableHead, TableHeadCell, TableRow, Text } from '@melchor629/ui'
import { Add } from '@melchor629/ui/icons'
import { useState } from 'react'
import type { GetApplication } from '../../../../queries/application/get-application'
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
      <div className="flex justify-between items-baseline mb-2">
        <Text size="h3">Permissions</Text>
        {!readOnly && <Button type="button" size="small" onClick={() => setOpened(true)} icon={<Add />} />}
      </div>
      <TableContainer>
        <Table hover full>
          <TableHead>
            <TableRow>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Display Name</TableHeadCell>
              <TableHeadCell shrink>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <EditApplicationPermissionRow
                key={permission.name}
                applicationId={applicationId}
                canDelete={canDelete}
                permission={permission}
                readOnly={readOnly}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
