import { useNavigate } from '@melchor629/nice-ssr'
import { TableCell, TableRow } from '@melchor629/ui'
import type { GetUsers } from '#queries/user/get-users.ts'
import { useResolvedProfilePic } from '../../../hooks'

const UserRow = ({ user }: { readonly user: GetUsers[0] }) => {
  const navigate = useNavigate()
  const resolvedProfilePicUrl = useResolvedProfilePic(user.profileImageUrl, user.userName)

  return (
    <TableRow
      key={user.userName}
      className="cursor-pointer"
      role="button"
      onClick={() => navigate(`/admin/users/${user.userName}`)}
    >
      <TableCell>
        {resolvedProfilePicUrl && (
          <img
            src={resolvedProfilePicUrl}
            alt={`${user.userName} profile`}
            className="rounded-md hover:scale-150 transition-transform"
            style={{ height: 26 }}
          />
        )}
      </TableCell>
      <TableCell>{user.userName}</TableCell>
      <TableCell>{user.displayName}</TableCell>
    </TableRow>
  )
}

export default UserRow
