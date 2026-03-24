import { Button, Table, TableBody, TableContainer, TableHead, TableHeadCell, TableRow, Text } from '@melchor629/ui'
import { Add } from '@melchor629/ui/icons'
import { useState } from 'react'
import type { GetUserQuery } from '../../../../queries/get-user'
import AddUserLoginDialog from './add-user-login-dialog'
import EditUserLoginRow from './edit-user-login-row'

type EditUserLoginsProps = Readonly<{
  canDelete: boolean
  readOnly: boolean
  user: GetUserQuery
}>

const EditUserLogins = ({
  canDelete,
  readOnly,
  user: { id, logins, userName },
}: EditUserLoginsProps) => {
  const [opened, setOpened] = useState(false)

  return (
    <div className="mt-8 mb-2">
      <div className="flex justify-between items-baseline mb-2">
        <Text size="h3">Logins</Text>
        {!readOnly && <Button type="button" size="small" onClick={() => setOpened(true)} icon={<Add />} />}
      </div>
      <TableContainer>
        <Table hover>
          <TableHead>
            <TableRow>
              <TableHeadCell>Type</TableHeadCell>
              <TableHeadCell>Login ID</TableHeadCell>
              <TableHeadCell>Data</TableHeadCell>
              <TableHeadCell>Disabled?</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logins!.map((login) => (
              <EditUserLoginRow
                key={login.id}
                canDelete={canDelete}
                login={login}
                readOnly={readOnly}
                userId={id}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!readOnly && <AddUserLoginDialog opened={opened} setOpened={setOpened} userId={id} userName={userName} />}
    </div>
  )
}

export default EditUserLogins
