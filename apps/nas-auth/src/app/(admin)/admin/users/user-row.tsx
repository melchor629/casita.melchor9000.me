import { useNavigate } from '@melchor629/nice-ssr'
import {
  TableColumn,
  TableRow,
} from '#components/ui/index.ts'
import type { GetUsers } from '#queries/get-users.ts'
import { useResolvedProfilePic } from '../../../hooks'

const UserRow = ({ user }: { readonly user: GetUsers[0] }) => {
  const navigate = useNavigate()
  const resolvedProfilePicUrl = useResolvedProfilePic(user.profileImageUrl, user.userName)

  return (
    <TableRow
      key={user.id}
      hover
      className="cursor-pointer"
      role="button"
      onClick={() => navigate(`/admin/users/${user.id}`)}
    >
      <TableColumn>{user.id}</TableColumn>
      <TableColumn>
        {resolvedProfilePicUrl && (
          <img
            src={resolvedProfilePicUrl}
            alt={`${user.userName} profile`}
            className="rounded-md hover:scale-150 transition-transform"
            style={{ height: 26 }}
          />
        )}
      </TableColumn>
      <TableColumn>{user.userName}</TableColumn>
      <TableColumn>{user.displayName}</TableColumn>
    </TableRow>
  )
}

export default UserRow
