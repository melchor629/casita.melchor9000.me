import { useState } from 'preact/hooks'
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
      <div className="flex justify-between mb-2">
        <H3>Logins</H3>
        {!readOnly && <Button type="button" size="sm" onClick={() => setOpened(true)}>Add Local login</Button>}
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadColumn>Type</TableHeadColumn>
            <TableHeadColumn>Login ID</TableHeadColumn>
            <TableHeadColumn>Data</TableHeadColumn>
            <TableHeadColumn>Disabled?</TableHeadColumn>
            <TableHeadColumn>Actions</TableHeadColumn>
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

      {!readOnly && <AddUserLoginDialog opened={opened} setOpened={setOpened} userId={id} userName={userName} />}
    </div>
  )
}

export default EditUserLogins
